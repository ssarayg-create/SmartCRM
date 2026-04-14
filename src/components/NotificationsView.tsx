import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  MoreVertical,
  Zap,
  Star,
  User as UserIcon,
  Trash2,
  Check,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Client } from '../types';
import { toast } from 'sonner';

interface NotificationsViewProps {
  clients: Client[];
  onViewLead: (client: Client) => void;
  onNavigateToAnalytics: (filter?: any) => void;
}

export default function NotificationsView({ clients, onViewLead, onNavigateToAnalytics }: NotificationsViewProps) {
  // Simular notificaciones basadas en clientes con seguimiento hoy o pasado
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [notifications, setNotifications] = useState(() => 
    clients
      .filter(c => new Date(c.proximoSeguimiento) <= today && c.estado !== 'Venta cerrada')
      .map(c => ({
        id: c.id,
        title: c.nombreNegocio,
        description: `Seguimiento pendiente con ${c.nombreContacto}`,
        time: 'Hoy',
        type: 'followup',
        priority: new Date(c.proximoSeguimiento) < today ? 'high' : 'medium',
        read: false,
        client: c
      }))
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Notificación marcada como leída');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info('Notificación eliminada');
  };

  const handleSnooze = (id: string) => {
    toast.info('Recordatorio pospuesto para mañana (simulado)');
    handleDelete(id);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Centro de <span className="text-primary">Notificaciones</span></h2>
          <p className="text-muted-foreground mt-2 font-semibold text-lg">Mantente al día con tus compromisos y tareas de seguimiento.</p>
        </div>
        <div className="flex items-center gap-3 bg-card px-5 py-2.5 rounded-2xl border border-border shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">En tiempo real</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-card border-none overflow-hidden rounded-[2.5rem] shadow-xl">
            <CardContent className="p-0">
              {notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={cn(
                        "flex items-center gap-4 p-6 hover:bg-muted transition-all cursor-pointer group relative",
                        !notif.read && "bg-primary/5"
                      )}
                      onClick={() => onViewLead(notif.client)}
                    >
                      {/* Avatar/Icon Section */}
                      <div className="relative shrink-0">
                        <div className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-105",
                          notif.priority === 'high' ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"
                        )}>
                          {notif.priority === 'high' ? <AlertCircle className="w-7 h-7" /> : <UserIcon className="w-7 h-7" />}
                        </div>
                        {!notif.read && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-card" />
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={cn(
                            "text-base tracking-tight truncate",
                            notif.read ? "font-bold text-muted-foreground" : "font-black text-foreground"
                          )}>
                            {notif.title}
                          </h3>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm truncate",
                          notif.read ? "text-muted-foreground font-medium" : "text-muted-foreground font-bold"
                        )}>
                          {notif.description}
                        </p>
                        
                        {/* WhatsApp-style Action Buttons (visible on hover or always) */}
                        <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 text-white h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewLead(notif.client);
                            }}
                          >
                            Contactar Ahora
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground border-border hover:bg-muted"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSnooze(notif.id);
                            }}
                          >
                            Posponer
                          </Button>
                        </div>
                      </div>

                      {/* Dropdown Menu */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            }
                          />
                          <DropdownMenuContent align="end" className="rounded-2xl p-2 border-border shadow-xl bg-card">
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-foreground"
                              onClick={() => handleMarkAsRead(notif.id)}
                            >
                              <Check className="w-4 h-4 mr-2 text-success" />
                              Marcar como leída
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-foreground"
                              onClick={() => onViewLead(notif.client)}
                            >
                              <ExternalLink className="w-4 h-4 mr-2 text-primary" />
                              Ver cliente
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-danger focus:text-danger"
                              onClick={() => handleDelete(notif.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success opacity-40" />
                  </div>
                  <p className="text-xl font-black uppercase tracking-widest">Todo al día</p>
                  <p className="text-sm font-bold mt-2">No tienes notificaciones pendientes por ahora.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Resumen de Actividad */}
          <Card className="glass-card border-none overflow-hidden rounded-[2.5rem] shadow-xl">
            <CardHeader className="bg-muted/50 border-b border-border p-8">
              <CardTitle className="text-lg font-black text-foreground">Resumen Semanal</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                {[
                  { label: 'Llamadas Realizadas', value: '24', icon: Phone, color: 'text-blue-500' },
                  { label: 'Emails Enviados', value: '48', icon: Mail, color: 'text-indigo-500' },
                  { label: 'Cierres Ganados', value: '3', icon: Star, color: 'text-success' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shadow-sm">
                        <stat.icon className={cn("w-4 h-4", stat.color)} />
                      </div>
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <span className="text-lg font-black text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-2xl border-border font-black text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all"
                onClick={() => onNavigateToAnalytics()}
              >
                Ver Reporte Completo
              </Button>
            </CardContent>
          </Card>

          {/* IA Tip */}
          <Card className="bg-gradient-to-br from-primary to-secondary border-none overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Zap className="w-5 h-5 text-yellow-300" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Tip de Productividad</p>
              </div>
              <p className="text-lg font-black leading-tight">
                "Los mejores vendedores contactan a sus leads en menos de 5 minutos."
              </p>
              <p className="text-xs text-blue-100 font-bold leading-relaxed opacity-80">
                Prioriza las notificaciones de alta prioridad para aumentar tu tasa de conversión en un 25%.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
