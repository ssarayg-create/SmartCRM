import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface AuthViewProps {
  onLogin: (user: any) => void;
}

export default function AuthView({ onLogin }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    // Simular latencia de red
    setTimeout(() => {
      // Usuario especial hardcodeado
      const specialUser = {
        id: 'u_val',
        name: 'Valentina Gutiérrez',
        email: 'valentinagutierrez@gmail.com',
        password: 'vale1234',
        role: 'Admin',
        plan: 'Premium',
        avatar: 'VG',
        salesCount: 12,
        closedRevenue: 4500000,
        hasSeenOnboarding: true
      };

      if (isLogin) {
        // 1. Validar PRIMERO el usuario especial
        if (formData.email === specialUser.email) {
          if (formData.password === specialUser.password) {
            toast.success('¡Bienvenido de nuevo, Valentina!');
            onLogin(specialUser);
            setIsLoading(false);
            return;
          } else {
            toast.error('Contraseña incorrecta');
            setIsLoading(false);
            return;
          }
        }

        // 2. Lógica para otros usuarios
        const savedUsers = JSON.parse(localStorage.getItem('crm_users') || '[]');
        const user = savedUsers.find((u: any) => u.email === formData.email);
        
        if (!user) {
          toast.error('Este usuario no está registrado. Por favor regístrate.');
          setIsLoading(false);
          return;
        }

        if (user.password !== formData.password) {
          toast.error('Contraseña incorrecta');
          setIsLoading(false);
          return;
        }

        toast.success('¡Bienvenido de nuevo!');
        onLogin(user);
      } else {
        // Registro
        const savedUsers = JSON.parse(localStorage.getItem('crm_users') || '[]');
        
        // No permitir registrar el email del usuario especial
        if (formData.email === specialUser.email) {
          toast.error('Este correo ya está registrado.');
          setIsLoading(false);
          return;
        }

        const existingUser = savedUsers.find((u: any) => u.email === formData.email);
        if (existingUser) {
          toast.error('Este correo ya está registrado.');
          setIsLoading(false);
          return;
        }

        const newUser = {
          id: 'u_' + Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'Vendedor',
          plan: 'Básico',
          avatar: formData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          salesCount: 0,
          closedRevenue: 0,
          hasSeenOnboarding: false
        };

        const updatedUsers = [...savedUsers, newUser];
        localStorage.setItem('crm_users', JSON.stringify(updatedUsers));
        
        toast.success('¡Cuenta creada con éxito!');
        onLogin(newUser);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Lado Izquierdo: Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground">Smart<span className="text-primary">CRM</span></h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-foreground leading-tight">
              La plataforma de ventas <span className="text-primary">más inteligente</span> para tu negocio.
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              Gestiona leads, automatiza seguimientos y cierra más ventas con el CRM preferido por las startups SaaS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="p-6 bg-card rounded-3xl shadow-sm border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <p className="font-black text-foreground">Seguridad Total</p>
              <p className="text-xs text-muted-foreground font-bold">Tus datos protegidos con encriptación de grado bancario.</p>
            </div>
            <div className="p-6 bg-card rounded-3xl shadow-sm border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="font-black text-foreground">Velocidad Rayo</p>
              <p className="text-xs text-muted-foreground font-bold">Interfaz optimizada para una gestión comercial fluida.</p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-card/60 backdrop-blur-sm rounded-[2.5rem]"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <p className="text-sm font-black text-foreground uppercase tracking-widest animate-pulse">Autenticando...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden bg-card">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-3xl font-black text-foreground tracking-tight">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </CardTitle>
              <CardDescription className="text-lg font-bold text-muted-foreground mt-2">
                {isLogin ? 'Ingresa tus credenciales para continuar.' : 'Únete a la revolución comercial hoy mismo.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre Completo</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          placeholder="Ej: Carlos Rodríguez" 
                          disabled={isLoading}
                          className="pl-12 h-14 rounded-2xl bg-muted border-border focus:ring-primary font-bold text-foreground"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="email"
                        placeholder="carlos@ejemplo.com" 
                        disabled={isLoading}
                        className="pl-12 h-14 rounded-2xl bg-muted border-border focus:ring-primary font-bold text-foreground"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Contraseña</Label>
                      {isLogin && (
                        <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        disabled={isLoading}
                        className="pl-12 h-14 rounded-2xl bg-muted border-border focus:ring-primary font-bold text-foreground"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 group">
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span>{isLogin ? 'Entrar al Sistema' : 'Registrarme Ahora'}</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-muted-foreground font-bold">
                      {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                      <button 
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-primary hover:underline"
                      >
                        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
