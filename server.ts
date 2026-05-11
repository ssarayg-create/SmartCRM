import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();
const PORT = 3000;

// Supabase Init with safety checks
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: any) => {
  try {
    return (
      !!url && 
      typeof url === 'string' && 
      url.startsWith('http') && 
      !url.includes('missing-config') && 
      !url.includes('placeholder')
    );
  } catch {
    return false;
  }
};

const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseUrl.includes('missing-config') && 
  !supabaseUrl.includes('example.com') &&
  supabaseKey !== 'dummy-key' && 
  supabaseKey !== 'missing-key';

// JWT Secrets with safe fallbacks for development context
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'smartcrm-access-dev-key-999';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'smartcrm-refresh-dev-key-888';

if (isSupabaseConfigured) {
  console.log('>> SmartCRM: Conexión con Supabase establecida.');
} else {
  console.log('>> SmartCRM: Sistema operando en configuración local/desarrollo.');
}

const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl! : 'https://api.supabase.co',
  supabaseKey || 'dummy-key'
);

async function startServer() {
  const app = express();

  // Basic Security & Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Vite handles CSP in dev
  }));
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Rate Limiting
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Demasiados intentos, intente más tarde.' }
  });

  // --- Auth Middleware ---
  const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as any;
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
  };

  const authorize = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes' });
      }
      next();
    };
  };

  // --- Helpers ---
  const generateTokens = (user: any) => {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
  };

  // --- API Routes ---

  // Sync with Supabase (Generic for Google and Email/Password)
  app.post('/api/auth/sync', async (req, res) => {
    const { idToken } = req.body;
    try {
      // Validate Supabase token
      const { data: { user }, error } = await supabase.auth.getUser(idToken);
      if (error || !user) throw error || new Error('No user found');

      // Find or Create in Prisma
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { achievements: true, medals: true }
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.user_metadata.full_name || user.user_metadata.name || user.email!.split('@')[0],
            avatar: user.user_metadata.avatar_url,
            googleId: user.app_metadata.provider === 'google' ? user.id : null,
            role: 'Vendedor',
            plan: 'Básico',
            salesCount: 0,
            closedRevenue: 0,
            points: 0
          },
          include: { achievements: true, medals: true }
        });
      }

      const { accessToken, refreshToken } = generateTokens(dbUser);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ user: dbUser, accessToken });
    } catch (err: any) {
      res.status(401).json({ message: 'Error de sincronización', error: err.message });
    }
  });

  // Demo Login (Skip real auth)
  app.post('/api/auth/demo-login', async (req, res) => {
    const { email, password } = req.body;
    if (email === 'valentinagutierrez@gmail.com' && password === 'vale1234') {
      try {
        let dbUser = await prisma.user.findUnique({
          where: { email },
          include: { achievements: true, medals: true }
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email,
              name: 'Valentina Gutiérrez',
              role: 'Admin',
              plan: 'Macro',
              salesCount: 124,
              closedRevenue: 450000000,
              points: 2500,
              hasSeenOnboarding: true
            },
            include: { achievements: true, medals: true }
          });
          
          // Add some mock data for demo user
          await prisma.achievement.createMany({
            data: [
              { userId: dbUser.id, title: 'Super Vendedor', description: 'Realizó 100 ventas', icon: 'zap' },
              { userId: dbUser.id, title: 'Maestro del Cierre', description: 'Tasa de conversión > 40%', icon: 'target' }
            ]
          });
          
          // Re-fetch with data
          dbUser = await prisma.user.findUnique({
            where: { id: dbUser.id },
            include: { achievements: true, medals: true }
          }) as any;
        }

        const { accessToken, refreshToken } = generateTokens(dbUser);
        
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user: dbUser, accessToken });
      } catch (err: any) {
        res.status(500).json({ message: 'Error en sistema demo', error: err.message });
      }
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  });

  // Keep old Google endpoint for backward compatibility or redirect it to sync
  app.post('/api/auth/google', async (req, res) => {
    // Simply redirect to sync logic
    const { idToken } = req.body;
    req.body = { idToken };
    return (app as any)._router.handle({ method: 'POST', url: '/api/auth/sync', body: { idToken } }, res, () => {});
  });

  // Traditional Register
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ message: 'El usuario ya existe' });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'Vendedor'
        }
      });

      res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err: any) {
      res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
    }
  });

  // Traditional Login
  app.post('/api/auth/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

      // Check lock
      if (user.lockUntil && user.lockUntil > new Date()) {
        return res.status(403).json({ message: 'Cuenta bloqueada temporalmente. Intente más tarde.' });
      }

      const validPassword = user.password ? await bcrypt.compare(password, user.password) : false;
      
      if (!validPassword) {
        const attempts = user.loginAttempts + 1;
        if (attempts >= 5) {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              loginAttempts: attempts, 
              lockUntil: new Date(Date.now() + 15 * 60 * 1000) 
            }
          });
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: { loginAttempts: attempts }
          });
        }
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Reset attempts on success
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0, lockUntil: null }
      });

      const { accessToken, refreshToken } = generateTokens(user);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ user, accessToken });
    } catch (err: any) {
      res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
  });

  // Refresh Token
  app.post('/api/auth/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) throw new Error('User not found');

      const tokens = generateTokens(user);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (err) {
      res.status(403).json({ message: 'Refresh token inválido' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Sesión cerrada' });
  });

  // Password Recovery (Mock - logic included)
  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.json({ message: 'Si el email está registrado, recibirá un correo.' });

      const token = Math.random().toString(36).substring(7);
      const expires = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token, resetExpires: expires }
      });

      // Here you would send the email
      console.log(`Email de recuperación para ${email}: Token ${token}`);
      
      res.json({ message: 'Si el email está registrado, recibirá un correo.' });
    } catch (err) {
      res.status(500).json({ message: 'Error' });
    }
  });

  // Get Profile
  app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error' });
    }
  });

  // --- Client Routes ---
  
  // Get all clients (or filtered by user if not admin)
  app.get('/api/clients', authenticateToken, async (req: any, res: any) => {
    try {
      const where = req.user.role === 'Admin' ? {} : { assignedToId: req.user.id };
      const clients = await prisma.client.findMany({
        where,
        include: { 
          assignedTo: { select: { id: true, name: true, email: true } },
          interactions: { orderBy: { timestamp: 'desc' } }
        },
        orderBy: { updatedAt: 'desc' }
      });
      res.json(clients);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener clientes' });
    }
  });

  // Create client
  app.post('/api/clients', authenticateToken, async (req: any, res: any) => {
    const data = req.body;
    try {
      // Unique phone check
      const existing = await prisma.client.findUnique({ where: { telefono: data.telefono } });
      if (existing) return res.status(400).json({ message: 'Ya existe un negocio con este teléfono' });

      const client = await prisma.client.create({
        data: {
          ...data,
          assignedToId: req.user.id // Default assign to creator
        },
        include: { assignedTo: true }
      });
      res.status(201).json(client);
    } catch (err: any) {
      res.status(500).json({ message: 'Error al crear cliente', error: err.message });
    }
  });

  // Update client
  app.put('/api/clients/:id', authenticateToken, async (req: any, res: any) => {
    const { id } = req.params;
    const data = req.body;
    try {
      // Permission check
      const existingClient = await prisma.client.findUnique({ where: { id } });
      if (!existingClient) return res.status(404).json({ message: 'Cliente no encontrado' });
      
      if (req.user.role !== 'Admin' && existingClient.assignedToId !== req.user.id) {
        return res.status(403).json({ message: 'No tiene permiso para editar este cliente' });
      }

      // Phone uniqueness check if changed
      if (data.telefono && data.telefono !== existingClient.telefono) {
        const other = await prisma.client.findUnique({ where: { telefono: data.telefono } });
        if (other) return res.status(400).json({ message: 'Ya existe un negocio con este teléfono' });
      }

      const updated = await prisma.client.update({
        where: { id },
        data,
        include: { assignedTo: true, interactions: true }
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar cliente' });
    }
  });

  // Onboarding Status
  app.post('/api/users/onboarding', authenticateToken, async (req: any, res: any) => {
    try {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { hasSeenOnboarding: true }
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'Error' });
    }
  });

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
