
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
import { cn, formatCurrency } from '@/lib/utils';
import { USERS } from '../constants';
import { getRecommendation } from '../lib/crm-logic';
import { getCommercialRecommendation, generateContextualProposal } from '../services/geminiService';
import { toast } from 'sonner';
import { 
  FileText,
  Copy,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';

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

  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [showProposal, setShowProposal] = useState(false);

  const assignedUser = USERS.find(u => u.id === client.assignedTo);
  const recommendation = getRecommendation(client.tipoNegocio);

  const STAGES: LeadStatus[] = [
    "Nuevos prospectos", 
    "Contacto inicial", 
    "Presentación", 
    "Negociación", 
    "Propuesta enviada", 
    "Ganado", 
    "Perdido"
  ];

  const getStatusConfig = (status: LeadStatus) => {
    const config: Record<LeadStatus, { color: string, bg: string, icon: any }> = {
      "Nuevos prospectos": { color: "text-muted-foreground", bg: "bg-muted", icon: AlertCircle },
      "Contacto inicial": { color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock },
      "Presentación": { color: "text-indigo-500", bg: "bg-indigo-500/10", icon: TrendingUp },
      "Negociación": { color: "text-warning", bg: "bg-warning/10", icon: Clock },
      "Propuesta enviada": { color: "text-primary", bg: "bg-primary/10", icon: Sparkles },
      "Ganado": { color: "text-success", bg: "bg-success/10", icon: CheckCircle2 },
      "Perdido": { color: "text-danger", bg: "bg-danger/10", icon: AlertCircle },
      "Demo": { color: "text-purple-500", bg: "bg-purple-500/10", icon: TrendingUp },
      "Cerrado": { color: "text-slate-700", bg: "bg-slate-700/10", icon: CheckCircle2 },
      "Nuevo lead": { color: "text-teal-500", bg: "bg-teal-500/10", icon: AlertCircle }
    };
    return config[status] || config["Nuevos prospectos"];
  };

  const statusConfig = getStatusConfig(client.estado);

  const handleStatusChange = (newStatus: LeadStatus) => {
    onUpdateClient(client.id, { estado: newStatus });
    toast.success(`Estado actualizado a: ${newStatus}`);
    
    onAddInteraction(client.id, {
      timestamp: new Date().toISOString(),
      type: 'Cambio de Estado',
      content: `El negocio pasó de "${client.estado}" a "${newStatus}"`,
      userId: assignedUser?.id || '1'
    });
  };

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

  const handleGenerateProposal = async () => {
    // REGLA: IF campos incompletos → NO generar propuesta
    if (!client.nombreNegocio || !client.tipoNegocio || !client.necesidadDetectada) {
      toast.error("Complete los datos del negocio (tipo y necesidad) para generar una propuesta.", {
        description: "Se requiere: Nombre, Tipo de Negocio y Necesidad Detectada."
      });
      return;
    }

    setIsGeneratingProposal(true);
    try {
      const proposal = await generateContextualProposal({
        negocio: client.nombreNegocio,
        contacto: client.nombreContacto,
        necesidad: client.necesidadDetectada,
        equipo: client.equipoOfrecido || 'Tiendana Elite',
        presupuesto: client.presupuestoEstimado
      });
      setGeneratedProposal(proposal);
      setShowProposal(true);
      toast.success("Propuesta comercial generada con éxito");
    } catch (error) {
      toast.error("Error al generar la propuesta");
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handleCopyProposal = () => {
    if (generatedProposal) {
      navigator.clipboard.writeText(generatedProposal);
      toast.success("Propuesta copiada al portapapeles");
    }
  };

  const handleSendProposal = () => {
    if (generatedProposal) {
      const cleanNumber = client.telefono.replace(/\s/g, '');
      const encodedMsg = encodeURIComponent(generatedProposal);
      window.open(`https://wa.me/${cleanNumber}?text=${encodedMsg}`, '_blank');
      toast.success("Enviando propuesta vía WhatsApp");
    }
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
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.75rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-2xl font-black text-white border border-white/20 shadow-2xl">
                {client.nombreNegocio.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black tracking-tighter">{client.nombreNegocio}</h2>
                  
                  {/* Selector de Estado Moderno */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "font-black text-[10px] uppercase tracking-[0.1em] border-none px-4 py-1 h-7 rounded-full cursor-pointer hover:scale-105 transition-transform", 
                          statusConfig.bg, 
                          statusConfig.color
                        )}
                      >
                        {client.estado}
                        <ChevronDown className="w-3 h-3 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-2xl border-border bg-card shadow-2xl p-2 min-w-[200px]">
                      {STAGES.map((stage) => (
                        <DropdownMenuItem 
                          key={stage}
                          onClick={() => handleStatusChange(stage)}
                          className={cn(
                            "rounded-xl font-bold text-xs py-2.5 mb-1 cursor-pointer",
                            client.estado === stage ? "bg-primary text-white" : "hover:bg-muted"
                          )}
                        >
                          {stage}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Badge className={cn("font-black text-[10px] uppercase tracking-[0.1em] border-none px-4 py-2 rounded-full", getTempColor(client.temperatura))}>
                    {client.temperatura}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-slate-400 font-bold text-sm mt-1.5 bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/5">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" />
                    {client.nombreContacto}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    {client.tipoNegocio}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-2xl text-white/50 hover:text-white hover:bg-white/10 w-12 h-12 border border-white/10">
                    <MoreVertical className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-[2rem] p-4 border-border shadow-2xl bg-card min-w-[240px]">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 ml-2">Gestión de Cliente</h4>
                  <DropdownMenuItem onClick={() => onEdit(client)} className="rounded-xl font-bold text-sm py-3 cursor-pointer text-foreground flex items-center gap-3 hover:bg-muted mb-1">
                    <ExternalLink className="w-4 h-4 text-primary" /> Editar Datos Maestro
                  </DropdownMenuItem>
                  
                  <Separator className="my-2" />
                  
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 mt-2 ml-2">Transferir a Asesor</h4>
                  <div className="space-y-1">
                    {USERS.filter(u => u.id !== client.assignedTo).map(user => (
                      <DropdownMenuItem 
                        key={user.id}
                        onClick={() => {
                          onTransfer(client.id, user.id);
                          toast.success(`Cliente transferido a ${user.name}`);
                          onAddInteraction(client.id, {
                            timestamp: new Date().toISOString(),
                            type: 'Transferencia',
                            content: `Cliente transferido a ${user.name}`,
                            userId: 'u1'
                          });
                        }}
                        className="rounded-xl font-bold text-xs py-2.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <span className="text-base">{user.avatar}</span> {user.name}
                      </DropdownMenuItem>
                    ))}
                  </div>

                  <Separator className="my-2" />
                  <DropdownMenuItem onClick={() => onDelete(client.id)} className="rounded-xl font-bold text-sm py-3 cursor-pointer text-danger hover:bg-danger/10 flex items-center gap-3">
                    <Trash2 className="w-4 h-4" /> Eliminar Negocio
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl text-white/50 hover:text-white hover:bg-white/10 w-12 h-12 border border-white/10">
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
                      <div className="p-5 rounded-3xl bg-muted border border-border group hover:bg-muted/80 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                               <Package className="w-3.5 h-3.5 text-primary" /> Solución POS Sugerida
                            </p>
                            <p className="text-base font-black text-foreground">{client.equipoOfrecido || 'Pendiente por definir'}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Presupuesto Estimado</p>
                             <p className="text-base font-black text-primary">{formatCurrency(client.presupuestoEstimado || 0)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-3xl bg-muted border border-border group hover:bg-muted/80 transition-colors">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-primary" /> Fecha Registro
                          </p>
                          <p className="text-sm font-black text-foreground">
                            {(() => {
                              const dateStr = typeof client.fechaRegistro === 'string' ? client.fechaRegistro : (client.fechaRegistro as any).toISOString();
                              return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
                            })()}
                          </p>
                        </div>
                        <div className="p-5 rounded-3xl bg-muted border border-border group hover:bg-muted/80 transition-colors border-rose-500/10">
                          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> Próximo Seguimiento
                          </p>
                          <p className="text-sm font-black text-foreground">
                            {(() => {
                               const dateStr = typeof client.proximoSeguimiento === 'string' ? client.proximoSeguimiento : (client.proximoSeguimiento as any).toISOString();
                               return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
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
                    <Button 
                      onClick={handleGenerateProposal}
                      disabled={isGeneratingProposal}
                      className="w-full rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black h-12 shadow-lg shadow-secondary/20 transition-all"
                    >
                      {isGeneratingProposal ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                      Generar Propuesta IA
                    </Button>
                  </div>
                </section>

                {generatedProposal && (
                  <section className="p-6 rounded-[2rem] bg-card border border-primary/20 shadow-xl animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Propuesta Generada</span>
                       </div>
                       <Button variant="ghost" size="sm" onClick={() => setShowProposal(!showProposal)} className="h-8 w-8 p-0 rounded-lg">
                         {showProposal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                       </Button>
                    </div>
                    
                    {showProposal && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="bg-muted p-4 rounded-xl max-h-[200px] overflow-y-auto scrollbar-hide">
                          <p className="text-[11px] font-medium leading-relaxed whitespace-pre-wrap text-muted-foreground">
                            {generatedProposal}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCopyProposal}
                            className="rounded-xl border-border font-bold text-[10px]"
                          >
                            <Copy className="w-3.5 h-3.5 mr-2" /> Copiar
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSendProposal}
                            className="rounded-xl bg-primary font-bold text-[10px]"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-2" /> Enviar WA
                          </Button>
                        </div>
                      </div>
                    )}
                  </section>
                )}

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
