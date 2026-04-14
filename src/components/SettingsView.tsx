import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Palette
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SettingsViewProps {
  businessTypes: string[];
  setBusinessTypes: (types: string[]) => void;
  userProfile: { name: string; email: string };
  setUserProfile: (profile: { name: string; email: string }) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function SettingsView({ 
  businessTypes, 
  setBusinessTypes, 
  userProfile, 
  setUserProfile,
  darkMode,
  setDarkMode
}: SettingsViewProps) {
  const [newType, setNewType] = useState('');
  const [profile, setProfile] = useState(userProfile);
  const [preferences, setPreferences] = useState({
    notifications: true,
    security: true
  });

  const handleSaveProfile = () => {
    setUserProfile(profile);
    toast.success('Perfil actualizado correctamente');
  };

  const togglePreference = (key: 'notifications' | 'security') => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preferencia actualizada');
  };

  const handleAddType = () => {
    if (newType && !businessTypes.includes(newType)) {
      setBusinessTypes([...businessTypes, newType]);
      setNewType('');
      toast.success('Tipo de negocio agregado');
    }
  };

  const handleRemoveType = (type: string) => {
    setBusinessTypes(businessTypes.filter(t => t !== type));
    toast.info('Tipo de negocio eliminado');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-4xl font-black tracking-tighter text-foreground">Configuración del <span className="text-primary">Sistema</span></h2>
        <p className="text-muted-foreground mt-2 font-semibold text-lg">Personaliza tu experiencia y gestiona los parámetros de tu CRM.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Perfil */}
          <Card className="glass-card border-none overflow-hidden">
            <CardHeader className="bg-muted/50 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-foreground">Perfil de Usuario</CardTitle>
                  <CardDescription className="font-bold text-muted-foreground">Gestiona tu información personal.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="pl-11 h-12 rounded-2xl bg-muted border-border font-bold text-foreground focus-visible:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="pl-11 h-12 rounded-2xl bg-muted border-border font-bold text-foreground focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Negocio */}
          <Card className="glass-card border-none overflow-hidden">
            <CardHeader className="bg-muted/50 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-foreground">Tipos de Negocio</CardTitle>
                  <CardDescription className="font-bold text-muted-foreground">Define las categorías de tus clientes.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex gap-3">
                <Input 
                  placeholder="Ej: Restaurante, Bar, etc."
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="h-12 rounded-2xl bg-muted border-border font-bold text-foreground focus-visible:ring-secondary"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
                />
                <Button onClick={handleAddType} className="h-12 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black px-6 shadow-lg shadow-secondary/20">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {businessTypes.map((type) => (
                  <div 
                    key={type} 
                    className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-sm group hover:border-secondary transition-all"
                  >
                    <span className="text-sm font-black text-foreground">{type}</span>
                    <button 
                      onClick={() => handleRemoveType(type)}
                      className="text-muted-foreground hover:text-danger transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Preferencias Rápidas */}
          <Card className="glass-card border-none overflow-hidden">
            <CardHeader className="bg-muted/50 border-b border-border">
              <CardTitle className="text-lg font-black text-foreground">Preferencias</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { id: 'notifications', icon: Bell, label: 'Notificaciones Push', active: preferences.notifications, action: () => togglePreference('notifications') },
                { id: 'security', icon: Shield, label: 'Seguridad Avanzada', active: preferences.security, action: () => togglePreference('security') },
                { id: 'darkMode', icon: Palette, label: 'Modo Oscuro', active: darkMode, action: () => setDarkMode(!darkMode) },
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={item.action}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn(
                      "w-4 h-4 transition-colors",
                      item.active ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-bold text-muted-foreground">{item.label}</span>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-all duration-300",
                    item.active ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm",
                      item.active ? "left-6" : "left-1"
                    )} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Estado del Sistema */}
          <Card className="bg-slate-950 border-none overflow-hidden text-white">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sistema</p>
                  <p className="text-lg font-black">Operativo</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Almacenamiento</span>
                  <span>12%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[12%] bg-primary" />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Tu instancia de SmartCRM está actualizada a la última versión (v2.4.0).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
