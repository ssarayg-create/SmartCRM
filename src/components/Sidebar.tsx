
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight,
  BarChart3,
  Trophy,
  CreditCard,
  Zap,
  MessageSquare,
  AlertTriangle,
  CalendarDays,
  Moon,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: { name: string; email: string };
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  userProfile, 
  onLogout, 
  isOpen, 
  onClose,
  darkMode,
  setDarkMode
}: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Negocios POS', icon: Users },
    { id: 'pipeline', label: 'Pipeline POS', icon: Kanban },
    { id: 'calendar', label: 'Calendario', icon: CalendarDays },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ranking', label: 'Ranking Asesores', icon: Trophy },
    { id: 'chat', label: 'Chat Interno', icon: MessageSquare },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="p-8 pb-6 shrink-0 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter">Smart<span className="text-primary italic">CRM</span></h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Verified SaaS</p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-muted-foreground hover:text-white transition-colors">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
          </div>
        </div>

        {/* Navigation Section - Independent Scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide space-y-8">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-4">Menú Principal</p>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "sidebar-item w-full group relative py-3.5",
                    activeTab === item.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="flex-1 text-left font-bold">{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div layoutId="active-pill" className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-1">
             <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-4">Administración</p>
             <nav className="space-y-1">
                <button 
                  onClick={() => handleTabClick('pricing')}
                  className={cn(
                    "sidebar-item w-full",
                    activeTab === 'pricing' ? "bg-primary text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-bold">Planes</span>
                </button>
                <button 
                  onClick={() => handleTabClick('settings')}
                  className={cn(
                    "sidebar-item w-full",
                    activeTab === 'settings' ? "bg-primary text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-bold">Ajustes</span>
                </button>
             </nav>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-6 shrink-0 border-t border-sidebar-border space-y-6">
          {/* Theme Toggle Wrapper */}
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tema</span>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5"
            >
              <div className={cn("p-1.5 rounded-lg transition-all", !darkMode ? "bg-primary text-white shadow-lg" : "text-slate-500")}>
                <Sun className="w-3.5 h-3.5" />
              </div>
              <div className={cn("p-1.5 rounded-lg transition-all", darkMode ? "bg-primary text-white shadow-lg" : "text-slate-500")}>
                <Moon className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white shadow-lg border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black truncate">{userProfile.name}</p>
              <p className="text-[9px] text-primary font-black uppercase tracking-widest">Enterprise v1.2</p>
            </div>
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="p-2.5 hover:bg-rose-500/10 rounded-xl transition-colors group shrink-0"
            >
              <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-card rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border border-border"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <LogOut className="w-24 h-24 text-foreground" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-danger" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tighter text-foreground">¿Cerrar Sesión?</h3>
                  <p className="text-muted-foreground font-bold leading-relaxed">
                    ¿Estás seguro de cerrar sesión? Tendrás que ingresar tus credenciales nuevamente.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="h-12 rounded-2xl border-border font-black text-muted-foreground hover:bg-muted"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={onLogout}
                    className="h-12 rounded-2xl bg-danger hover:bg-danger/90 text-white font-black shadow-lg shadow-danger/20"
                  >
                    Sí, Salir
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
