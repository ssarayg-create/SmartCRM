import { supabase, isSupabaseConfigured } from '../lib/supabase';

const API_URL = '/api/auth';

export const authService = {
  async syncWithBackend(idToken: string) {
    const response = await fetch(`${API_URL}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al sincronizar con el servidor');
    }
    return response.json();
  },

  async loginWithGoogle() {
    if (!isSupabaseConfigured) {
      throw new Error('Configuración de Supabase no encontrada. Por favor, agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Settings para que el login sea real.');
    }
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          }
        }
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Google Login Error:', err);
      throw err;
    }
  },

  async login(email: string, password: string) {
    // 1. USUARIO DEMO (PRIORIDAD MÁXIMA)
    if (email === 'valentinagutierrez@gmail.com' && password === 'vale1234') {
      const demoUser = {
        id: 'demo-user-123',
        email: 'valentinagutierrez@gmail.com',
        name: 'Valentina Gutiérrez',
        role: 'Admin',
        plan: 'Macro',
        demo: true
      };
      
      const session = {
        user: demoUser,
        accessToken: 'demo-token-' + Date.now(),
        expiresAt: Date.now() + 3600000 // 1 hour
      };
      
      localStorage.setItem('smartcrm_session', JSON.stringify(session));
      return session;
    }

    // 2. SUPABASE FLOW (If configured)
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) throw new Error('Contraseña incorrecta');
          if (error.message.includes('User not found')) throw new Error('Usuario no registrado');
          throw new Error(error.message);
        }

        if (!data.session) throw new Error('No se pudo iniciar sesión');

        // Note: For full-stack, we usually syncWithBackend here.
        // But for reliability in this hybrid mode, we can store locally too.
        const session = {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            role: 'Vendedor'
          },
          accessToken: data.session.access_token
        };
        
        localStorage.setItem('smartcrm_session', JSON.stringify(session));
        return session;
      } catch (err: any) {
        console.error('Supabase Login Error:', err);
        throw err;
      }
    }

    // 3. SECUNDARIO: LOCAL STORAGE FLOW (FALLBACK)
    const storedUsers = JSON.parse(localStorage.getItem('smartcrm_local_users') || '[]');
    const localUser = storedUsers.find((u: any) => u.email === email && u.password === password);

    if (localUser) {
      const session = {
        user: {
          id: localUser.id,
          email: localUser.email,
          name: localUser.name,
          role: localUser.role || 'Vendedor'
        },
        accessToken: 'local-token-' + Date.now()
      };
      localStorage.setItem('smartcrm_session', JSON.stringify(session));
      return session;
    }

    throw new Error('Usuario no registrado o contraseña incorrecta');
  },

  async register(formData: any) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) throw new Error('El usuario ya existe');
          throw error;
        }

        if (data.session) {
          const session = {
            user: {
              id: data.user!.id,
              email: data.user!.email,
              name: formData.name,
              role: 'Vendedor'
            },
            accessToken: data.session.access_token
          };
          localStorage.setItem('smartcrm_session', JSON.stringify(session));
          return session;
        }
        
        return { message: 'Registro exitoso. Revisa tu correo.' };
      } catch (err: any) {
        console.error('Supabase Register Error:', err);
        throw err;
      }
    }

    // LOCAL STORAGE REGISTRATION (FALLBACK)
    const storedUsers = JSON.parse(localStorage.getItem('smartcrm_local_users') || '[]');
    if (storedUsers.some((u: any) => u.email === formData.email)) {
      throw new Error('El usuario ya está registrado localmente');
    }

    const newUser = {
      id: 'local-' + Date.now(),
      email: formData.email,
      password: formData.password, // In a real app we'd hash, but this is demo/local mode
      name: formData.name,
      role: 'Vendedor'
    };

    storedUsers.push(newUser);
    localStorage.setItem('smartcrm_local_users', JSON.stringify(storedUsers));
    
    return { message: 'Registro local exitoso. Ahora puedes iniciar sesión.' };
  },

  async refreshToken() {
    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Refresh failed');
    return response.json();
  },

  async resetPassword(email: string) {
    if (email === 'valentinagutierrez@gmail.com') {
      return { message: 'Se ha enviado un enlace de recuperación a tu correo de demostración.' };
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        return { message: 'Se ha enviado un correo para restablecer tu contraseña.' };
      } catch (err: any) {
        console.error('Supabase Reset Password Error:', err);
        throw err;
      }
    }

    // Fallback Local
    const storedUsers = JSON.parse(localStorage.getItem('smartcrm_local_users') || '[]');
    if (storedUsers.some((u: any) => u.email === email)) {
      return { message: 'Se ha enviado un correo local (Simulado).' };
    }

    throw new Error('No se encontró una cuenta con ese correo electrónico.');
  },

  async logout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('smartcrm_session');
    // Also try to clear backend session if it exists
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST' });
    } catch {
      // Ignore background logout errors
    }
    return { success: true };
  }
};
