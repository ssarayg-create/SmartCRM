
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
  Play,
  Sparkles
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
}

export default function Sidebar({ activeTab, setActiveTab, userProfile, onLogout, isOpen, onClose }: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Negocios POS', icon: Users },
    { id: 'pipeline', label: 'Pipeline POS', icon: Kanban },
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
      {/* Backdrop for mobile */}
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
        "fixed inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section - Fixed at top */}
        <div className="p-8 pb-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 group hover:rotate-0 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-sidebar-foreground">Smart<span className="text-primary">CRM</span></h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">SaaS Edition</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-muted-foreground hover:text-sidebar-foreground">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
          </div>
        </div>

        {/* Navigation Section - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-2 scrollbar-hide">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "sidebar-item w-full group relative overflow-hidden",
                  activeTab === item.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {activeTab === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  activeTab === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                )} />
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Section - Fixed at bottom */}
        <div className="p-8 pt-4 space-y-4 shrink-0 border-t border-sidebar-border bg-sidebar/50 backdrop-blur-md">
          <button 
            onClick={() => handleTabClick('pricing')}
            className={cn(
              "sidebar-item w-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-sidebar-border",
              activeTab === 'pricing' ? "text-primary border-primary/20" : "text-muted-foreground hover:text-sidebar-foreground"
            )}
          >
            <CreditCard className="w-5 h-5" />
            <span>Planes y Precios</span>
          </button>

          <button 
            onClick={() => handleTabClick('settings')}
            className={cn(
              "sidebar-item w-full",
              activeTab === 'settings' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Settings className="w-5 h-5" />
            <span>Configuración</span>
          </button>
          
          <div className="flex items-center gap-4 px-2 py-4 border-t border-sidebar-border pt-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white shadow-lg border border-white/10 shrink-0">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black truncate text-sidebar-foreground">{userProfile.name}</p>
              <p className="text-[10px] text-muted-foreground truncate font-bold uppercase tracking-wider">Plan Enterprise</p>
            </div>
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="p-2 hover:bg-danger/10 rounded-xl transition-colors group shrink-0"
            >
              <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-danger transition-colors" />
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
