
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
  Package,
  MoreVertical,
  Trash2,
  UserPlus,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Client, LeadStatus, Interaction, ClientTemperature } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';
import { getRecommendation } from '../lib/crm-logic';
import { getCommercialRecommendation } from '../services/geminiService';
import { toast } from 'sonner';

interface ClientDetailViewProps {
  client: Client;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onTransfer: (clientId: string, userId: string) => void;
  onUpdateClient: (clientId: string, data: Partial<Client>) => void;
  onOpenChat: (client: Client) => void;
  onAddInteraction: (clientId: string, interaction: Omit<Interaction, 'id'>) => void;
}

export default function ClientDetailView({ 
  client, 
  onClose, 
  onEdit, 
  onDelete,
  onTransfer,
  onUpdateClient,
  onOpenChat, 
  onAddInteraction 
}: ClientDetailViewProps) {
  const [newInteraction, setNewInteraction] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    recomendacion: string;
    proximaAccion: string;
    proximaFecha: string;
    equipoSugerido: string;
    planSugerido: string;
  } | null>(null);

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

  const getTempColor = (temp: ClientTemperature) => {
    switch (temp) {
      case 'Caliente': return 'text-rose-500 bg-rose-500/10';
      case 'Tibio': return 'text-amber-500 bg-amber-500/10';
      case 'Frío': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const suggestion = await getCommercialRecommendation({
        negocio: client.nombreNegocio,
        estado: client.estado,
        temperatura: client.temperatura,
        necesidad: client.necesidadDetectada
      });
      setAiSuggestion(suggestion);
      toast.success("Sugerencia generada con éxito");
    } catch (error) {
      toast.error("Error al generar sugerencia");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleApplySuggestion = () => {
    if (!aiSuggestion) return;
    
    onUpdateClient(client.id, {
      proximoSeguimiento: aiSuggestion.proximaFecha,
      equipoOfrecido: aiSuggestion.equipoSugerido,
      solucionOfrecida: `Plan Tiendana ${aiSuggestion.planSugerido}`,
      necesidadDetectada: `${client.necesidadDetectada}\n\n[Sugerencia IA]: ${aiSuggestion.proximaAccion}`
    });

    onAddInteraction(client.id, {
      timestamp: new Date().toISOString(),
      type: 'Nota',
      content: `Sugerencia IA aplicada: ${aiSuggestion.recomendacion}. Plan: ${aiSuggestion.planSugerido}, Equipo: ${aiSuggestion.equipoSugerido}`,
      userId: assignedUser?.id || '1'
    });

    setAiSuggestion(null);
    toast.success("Sugerencia aplicada al cliente");
  };

  const handleWhatsApp = () => {
    const cleanNumber = client.telefono.replace(/\s/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

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
                  <Badge className={cn("font-black text-[9px] uppercase tracking-widest border-none px-2 py-0.5", getTempColor(client.temperatura))}>
                    {client.temperatura}
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
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 w-10 h-10">
                    <MoreVertical className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl p-2 border-border shadow-xl bg-card min-w-[180px]">
                  <DropdownMenuItem onClick={() => onEdit(client)} className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-foreground flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" /> Editar Datos
                  </DropdownMenuItem>
                  <Separator className="my-1" />
                  <DropdownMenuItem className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-foreground flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Transferir Asesor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(client.id)} className="rounded-xl font-bold text-xs py-2.5 cursor-pointer text-danger hover:bg-danger/10 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Eliminar Cliente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl text-white/50 hover:text-white hover:bg-white/10 w-10 h-10">
                <X className="w-6 h-6" />
              </Button>
            </div>
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
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Solución POS Ofrecida</p>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            <p className="text-sm font-bold text-foreground">{client.solucionOfrecida || 'Pendiente'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted border border-border flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Equipo Ofrecido</p>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-secondary" />
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
                          <p className="text-sm font-bold text-foreground">
                            {(() => {
                              const [y, m, d] = client.fechaRegistro.split('T')[0].split('-').map(Number);
                              return new Date(y, m - 1, d).toLocaleDateString();
                            })()}
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted border border-border">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Seguimiento</p>
                          <p className="text-sm font-bold text-warning">
                            {(() => {
                              const [y, m, d] = client.proximoSeguimiento.split('T')[0].split('-').map(Number);
                              return new Date(y, m - 1, d).toLocaleDateString();
                            })()}
                          </p>
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
                  <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/20">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">IA Comercial Gemini</span>
                      </div>
                      {isGeneratingAI && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    </div>

                    {aiSuggestion ? (
                      <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm font-medium leading-relaxed text-slate-300 italic">
                          "{aiSuggestion.recomendacion}"
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Equipo Sugerido</span>
                            <span className="text-secondary font-black uppercase tracking-widest">{aiSuggestion.equipoSugerido}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Plan Sugerido</span>
                            <span className="text-success font-black uppercase tracking-widest">{aiSuggestion.planSugerido}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Próxima Acción</span>
                            <span className="text-primary font-black uppercase tracking-widest">{aiSuggestion.proximaAccion}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Fecha Sugerida</span>
                            <span className="text-white font-black uppercase tracking-widest">{aiSuggestion.proximaFecha}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            onClick={() => setAiSuggestion(null)}
                            variant="outline"
                            className="rounded-xl border-white/20 text-white hover:bg-white/10 font-bold text-xs h-10 bg-transparent"
                          >
                            Descartar
                          </Button>
                          <Button 
                            onClick={handleApplySuggestion}
                            className="rounded-xl bg-primary text-white hover:bg-primary/90 font-bold text-xs h-10"
                          >
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-sm text-slate-400 font-medium">
                          Genera una estrategia de venta personalizada basada en el estado actual del cliente.
                        </p>
                        <Button 
                          onClick={handleGenerateAI}
                          disabled={isGeneratingAI}
                          className="w-full rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black h-12 shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isGeneratingAI ? 'Analizando...' : 'Generar Estrategia'}
                          {!isGeneratingAI && <Sparkles className="w-4 h-4 ml-2" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </section>

                <section className="p-6 rounded-[2rem] bg-muted border border-border">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Acciones Rápidas</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      onClick={handleWhatsApp}
                      className="w-full rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black h-12 shadow-lg shadow-[#25D366]/20 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contactar WhatsApp
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
          </div>
          <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black h-12 px-10 shadow-xl shadow-primary/20" onClick={onClose}>
            Cerrar Vista
          </Button>
        </div>
      </div>
    </div>
  );
}
