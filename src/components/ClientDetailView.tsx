
import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Building2, 
  User as UserIcon,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus,
  History,
  DollarSign,
  Package
} from 'lucide-react';
import { Client, LeadStatus, Interaction } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';
import { getRecommendation } from '../lib/crm-logic';
import { toast } from 'sonner';

interface ClientDetailViewProps {
  client: Client;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onOpenChat: (client: Client) => void;
  onAddInteraction: (clientId: string, interaction: Omit<Interaction, 'id'>) => void;
}

export default function ClientDetailView({ client, onClose, onEdit, onOpenChat, onAddInteraction }: ClientDetailViewProps) {
  const [newInteraction, setNewInteraction] = useState('');
  const assignedUser = USERS.find(u => u.id === client.assignedTo);
  const recommendation = getRecommendation(client.tipoNegocio);

  const getStatusConfig = (status: LeadStatus) => {
    const config: Record<LeadStatus, { color: string, bg: string, icon: any }> = {
      "Nuevo lead": { color: "text-muted-foreground", bg: "bg-muted", icon: AlertCircle },
      "Contacto inicial": { color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock },
      "Demo del sistema POS": { color: "text-indigo-500", bg: "bg-indigo-500/10", icon: TrendingUp },
      "Envío de propuesta": { color: "text-secondary", bg: "bg-secondary/10", icon: Mail },
      "Negociación": { color: "text-warning", bg: "bg-warning/10", icon: Clock },
      "Venta cerrada": { color: "text-success", bg: "bg-success/10", icon: CheckCircle2 }
    };
    return config[status] || config["Nuevo lead"];
  };

  const statusConfig = getStatusConfig(client.estado);

  const handleSendProposal = () => {
    toast.success("Propuesta enviada correctamente", {
      description: `Se ha enviado la propuesta comercial a ${client.nombreNegocio}.`,
      icon: <CheckCircle2 className="w-5 h-5 text-success" />
    });
  };

  const handleAddInteraction = () => {
    if (!newInteraction.trim()) return;
    
    onAddInteraction(client.id, {
      timestamp: new Date().toISOString(),
      type: 'Nota',
      content: newInteraction,
      userId: assignedUser?.id || '1'
    });
    
    setNewInteraction('');
    toast.success("Interacción registrada");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-6xl h-[92vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
        {/* Header */}
        <div className="bg-slate-950 p-6 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-black text-white border border-white/10">
                {client.nombreNegocio.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black tracking-tight">{client.nombreNegocio}</h2>
                  <Badge className={cn("font-black text-[9px] uppercase tracking-widest border-none px-2 py-0.5", statusConfig.bg, statusConfig.color)}>
                    {client.estado}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-bold text-xs mt-0.5">
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5" />
                    {client.nombreContacto}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {client.tipoNegocio}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 w-10 h-10">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column: Info & Details */}
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section>
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Información de Contacto</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
                        <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Teléfono</p>
                          <p className="text-sm font-bold text-foreground">{client.telefono}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
                        <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm">
                          <Mail className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email</p>
                          <p className="text-sm font-bold text-foreground">{client.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
                        <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm">
                          <MapPin className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ubicación</p>
                          <p className="text-sm font-bold text-foreground">{client.ciudad}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Detalles del Negocio</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-2xl bg-muted border border-border flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Equipo Ofrecido</p>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            <p className="text-sm font-bold text-foreground">{client.equipoOfrecido || 'Pendiente'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted border border-border flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Presupuesto Estimado</p>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-success" />
                            <p className="text-sm font-bold text-foreground">${client.presupuestoEstimado.toLocaleString()} COP</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Probabilidad</p>
                          <p className="text-sm font-bold text-primary">{client.closingProbability}%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-muted border border-border">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Registro</p>
                          <p className="text-sm font-bold text-foreground">{new Date(client.fechaRegistro).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted border border-border">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Seguimiento</p>
                          <p className="text-sm font-bold text-warning">{new Date(client.proximoSeguimiento).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <section>
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Necesidad Detectada</h3>
                  <div className="p-6 rounded-3xl bg-muted border border-border">
                    <p className="text-sm text-foreground font-medium leading-relaxed italic">
                      "{client.necesidadDetectada || 'Sin necesidades registradas.'}"
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Historial de Interacciones</h3>
                    <Badge variant="outline" className="rounded-full font-bold text-[10px]">{client.historial.length} Eventos</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <textarea 
                        value={newInteraction}
                        onChange={(e) => setNewInteraction(e.target.value)}
                        placeholder="Registrar nueva interacción o nota..."
                        className="flex-1 min-h-[80px] rounded-2xl bg-muted border border-border p-4 focus:ring-2 focus:ring-primary focus:outline-none font-medium text-sm transition-all text-foreground"
                      />
                      <Button 
                        onClick={handleAddInteraction}
                        className="rounded-2xl bg-primary text-white h-auto px-6 font-black self-end"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      {client.historial.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
                          <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shrink-0 shadow-sm">
                            <History className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.type}</span>
                              <span className="text-[10px] font-bold text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-foreground font-medium">{item.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: AI & Actions */}
              <div className="space-y-10">
                <section>
                  <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-primary/20">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Smart Recommendation</span>
                    </div>
                    <p className="text-lg font-black leading-tight mb-6">
                      {recommendation.recomendar}
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">Plan Sugerido</span>
                        <Badge className="bg-primary/10 text-primary border-none font-black">{recommendation.plan}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-bold">Equipamiento</span>
                        <span className="text-white font-bold">{recommendation.equipos}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendProposal}
                      className="w-full mt-8 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black h-12 shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Enviar Propuesta
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </section>

                <section className="p-6 rounded-[2rem] bg-muted border border-border">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Asesor Asignado</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-black text-primary">
                      {assignedUser?.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">{assignedUser?.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{assignedUser?.role}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-muted border-t border-border flex justify-between items-center shrink-0">
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-2xl border-border font-bold h-12 px-6 text-foreground" onClick={() => onEdit(client)}>
              Editar Datos
            </Button>
            <Button variant="outline" className="rounded-2xl border-border font-bold h-12 px-6 text-foreground" onClick={() => onOpenChat(client)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Ver Chat
            </Button>
          </div>
          <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black h-12 px-10 shadow-xl shadow-primary/20" onClick={onClose}>
            Cerrar Vista
          </Button>
        </div>
      </div>
    </div>
  );
}
