import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cn } from '@/lib/utils';

interface AuthViewProps {
  onLogin: (user: any) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthView({ onLogin, initialMode = 'login' }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  useEffect(() => {
    // Escuchar cambios de autenticación de Supabase (especialmente para OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        try {
          // Sync existing session with backend
          const { user, accessToken } = await authService.syncWithBackend(session.access_token);
          localStorage.setItem('accessToken', accessToken);
          onLogin(user);
          toast.success(`¡Bienvenido, ${user.name}!`);
        } catch (error: any) {
          toast.error(error.message);
          await supabase.auth.signOut();
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [onLogin]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authService.loginWithGoogle();
      // El login real lo maneja onAuthStateChange una vez redireccionado
    } catch (error: any) {
      toast.error('Error al conectar con Google: ' + (error.message || 'Error desconocido'));
      setIsLoading(false);
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'El nombre es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // Lógica de Demo según requerimiento
        if (formData.email === "valentinagutierrez@gmail.com" && formData.password === "vale1234") {
          const demoUser = {
            id: 'u-demo',
            name: "Usuario 1",
            email: formData.email,
            role: "Admin",
            plan: 'Pro',
            avatar: 'U1',
            demo: true
          };
          localStorage.setItem("auth", JSON.stringify({ user: demoUser }));
          localStorage.setItem('accessToken', 'demo-token');
          onLogin(demoUser);
          toast.success("¡Bienvenido al modo Demo!");
          return;
        }

        const response = await authService.login(formData.email, formData.password);
        const { user, accessToken } = response as { user: any, accessToken: string };
        localStorage.setItem('accessToken', accessToken);
        onLogin(user);
        toast.success(`¡Bienvenido de nuevo, ${user.name}!`);
      } else {
        const response = await authService.register(formData);
        
        if (typeof response === 'object' && 'accessToken' in response) {
          const { user, accessToken } = response as { user: any, accessToken: string };
          localStorage.setItem('accessToken', accessToken);
          onLogin(user);
          toast.success(`¡Bienvenido, ${user.name}!`);
        } else {
          const res = response as { message: string };
          toast.success(res.message || 'Cuenta creada con éxito.');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
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
                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="h-14 rounded-2xl border-border hover:bg-muted font-bold text-foreground flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    )}
                    Continuar con Google
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                    <span className="bg-card px-4 text-muted-foreground">O accede con tu correo</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label className={cn("text-xs font-black uppercase tracking-widest ml-1", errors.name ? "text-rose-500" : "text-muted-foreground")}>Nombre Completo</Label>
                      <div className="relative">
                        <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", errors.name ? "text-rose-500" : "text-muted-foreground")} />
                        <Input 
                          placeholder="Ej: Carlos Rodríguez" 
                          disabled={isLoading}
                          className={cn(
                            "pl-12 h-14 rounded-2xl bg-muted border-border focus:ring-primary font-bold text-foreground",
                            errors.name && "border-rose-500 focus:ring-rose-500"
                          )}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name}</p>}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label className={cn("text-xs font-black uppercase tracking-widest ml-1", errors.email ? "text-rose-500" : "text-muted-foreground")}>Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", errors.email ? "text-rose-500" : "text-muted-foreground")} />
                      <Input 
                        type="email"
                        placeholder="carlos@ejemplo.com" 
                        disabled={isLoading}
                        className={cn(
                          "pl-12 h-14 rounded-2xl bg-muted border-border focus:ring-primary font-bold text-foreground",
                          errors.email && "border-rose-500 focus:ring-rose-500"
                        )}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <Label className={cn("text-xs font-black uppercase tracking-widest", errors.password ? "text-rose-500" : "text-muted-foreground")}>Contraseña</Label>
                      {isLogin && (
                        <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5", errors.password ? "text-rose-500" : "text-muted-foreground")} />
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        disabled={isLoading}
                        className={cn(
                          "pl-12 h-14 rounded-2xl bg-muted border-border focus:ring-primary font-bold text-foreground",
                          errors.password && "border-rose-500 focus:ring-rose-500"
                        )}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                    {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.password}</p>}
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
