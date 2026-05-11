import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Zap,
  Trash2,
  Check,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Search,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Client } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsViewProps {
  clients: Client[];
  onViewLead: (client: Client) => void;
  onNavigateToAnalytics: () => void;
}

export default function NotificationsView({ clients, onViewLead, onNavigateToAnalytics }: NotificationsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [postponeDate, setPostponeDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [notifications, setNotifications] = useState(() => {
    const followupNotifs = clients
      .filter(c => new Date(c.proximoSeguimiento) <= today && c.estado !== 'Cerrado')
      .map(c => ({
        id: `followup-${c.id}`,
        title: c.nombreNegocio,
        description: `Seguimiento pendiente con ${c.nombreContacto}`,
        time: 'Hoy',
        type: 'followup',
        priority: new Date(c.proximoSeguimiento) < today ? 'high' : 'medium',
        read: false,
        client: c
      }));

    const stagnantNotifs = clients
      .filter(c => {
        const lastContact = new Date(c.ultimoContacto);
        const diffDays = Math.floor((today.getTime() - lastContact.getTime()) / (1000 * 3600 * 24));
        return diffDays >= 7 && c.estado !== 'Cerrado';
      })
      .map(c => ({
        id: `stagnant-${c.id}`,
        title: c.nombreNegocio,
        description: `Sin contacto hace +7 días`,
        time: 'Alerta',
        type: 'stagnant',
        priority: 'high',
        read: false,
        client: c
      }));

    return [...followupNotifs, ...stagnantNotifs].sort((a, b) => (a.priority === 'high' ? -1 : 1));
  });

  const filteredNotifs = notifications.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Notificación marcada como leída');
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info('Notificación eliminada');
  };

  const handleSnooze = (id: string, date: string) => {
    toast.success('Recordatorio pospuesto', {
      description: `Se reprogramó para el ${date}`
    });
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedId(null);
  };

  const handleContact = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = client.telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=Hola%20${encodeURIComponent(client.nombreContacto)},%20te%20contacto%20de%20SmartCRM...`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Centro de <span className="text-primary italic">Mensajes</span></h2>
          <p className="text-muted-foreground font-semibold mt-1">Gestión rápida de seguimientos y alertas críticas.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar notificación..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl border-border bg-card font-bold text-sm h-11"
          />
        </div>
      </div>

      <Card className="border border-border rounded-[2.5rem] shadow-2xl bg-card overflow-hidden">
        <CardContent className="p-0">
          {filteredNotifs.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredNotifs.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "group flex items-start gap-4 p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer relative",
                    !notif.read && "bg-primary/[0.02]"
                  )}
                  onClick={() => onViewLead(notif.client)}
                >
                  {/* Status Indicator */}
                  {!notif.read && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                  )}

                  {/* Avatar Section */}
                  <div className="relative shrink-0 mt-1">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm",
                      notif.type === 'stagnant' ? "bg-orange-100 text-orange-600" : 
                      notif.priority === 'high' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {notif.type === 'stagnant' ? <Clock className="w-7 h-7" /> : 
                       notif.priority === 'high' ? <AlertCircle className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn(
                        "text-base truncate leading-none",
                        notif.read ? "font-bold text-slate-500" : "font-black text-slate-900 dark:text-white"
                      )}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-lg shrink-0">
                        {notif.time}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm truncate",
                      notif.read ? "text-slate-400 font-medium" : "text-slate-600 dark:text-slate-400 font-bold"
                    )}>
                      {notif.description}
                    </p>

                    {/* Functional Buttons - SaaS Style */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 text-white">
                      <Button 
                        size="sm" 
                        onClick={(e) => handleContact(notif.client, e)}
                        className="bg-[#25D366] hover:bg-[#20ba59] text-white h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest border-none flex items-center gap-2"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Contactar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(notif.id);
                        }}
                        className="h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest border-border text-muted-foreground hover:bg-muted"
                      >
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        Posponer
                      </Button>
                    </div>

                    {/* Postpone Date Picker Inline */}
                    <AnimatePresence>
                      {selectedId === notif.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-muted/30 rounded-[1.5rem] border border-border/50 space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                              <Calendar className="w-3 h-3" /> Seleccionar Fecha
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-lg"
                              onClick={() => setSelectedId(null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              type="date" 
                              className="h-10 rounded-xl bg-background border-border font-bold text-xs"
                              value={postponeDate}
                              onChange={(e) => setPostponeDate(e.target.value)}
                            />
                            <Button 
                              size="sm" 
                              className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest px-4"
                              onClick={() => handleSnooze(notif.id, postponeDate)}
                            >
                              Confirmar
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Context Menu */}
                  <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted text-muted-foreground">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 border-border shadow-2xl bg-card min-w-[180px]">
                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-xs py-3 cursor-pointer"
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                        >
                          <Check className="w-4 h-4 mr-3 text-emerald-500" />
                          Marcar como leída
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-xs py-3 cursor-pointer"
                          onClick={() => onViewLead(notif.client)}
                        >
                          <ExternalLink className="w-4 h-4 mr-3 text-blue-500" />
                          Ver detalle cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-xs py-3 cursor-pointer text-rose-500 focus:text-rose-500"
                          onClick={(e) => handleDelete(notif.id, e)}
                        >
                          <Trash2 className="w-4 h-4 mr-3" />
                          Eliminar permanente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8">
                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Buzón impecable</h3>
              <p className="text-muted-foreground font-bold mt-2 max-w-xs">No tienes alertas pendientes. ¡Buen trabajo con tus seguimientos!</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
                className="mt-8 rounded-2xl border-border font-black text-xs uppercase tracking-widest px-8"
              >
                Actualizar Lista
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 dark:bg-slate-950 border-none rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full -mr-24 -mt-24 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-2xl font-black leading-tight">Optimiza tu<br />Conversión</h4>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                El análisis de datos muestra que los cierres aumentan un 40% si contactas al cliente antes de 2 horas desde la alerta.
              </p>
            </div>
            <Button 
              onClick={onNavigateToAnalytics}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl border-none shadow-xl shadow-primary/30"
            >
              Abrir Analytics
            </Button>
          </div>
        </Card>

        <Card className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Rendimiento Hoy
              </h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="text-3xl font-black text-slate-900 dark:text-white">12</div>
                   <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tareas<br />Cerradas</div>
                   <div className="ml-auto w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                      +4
                   </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[65%]" />
                </div>
                <p className="text-xs text-muted-foreground font-bold italic">
                  "Vas mejor que el 85% de los asesores SmartCRM."
                </p>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
