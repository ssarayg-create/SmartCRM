
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
  Users,
  MessageSquare,
  TrendingUp,
  User as UserIcon,
  Building2,
  Package,
  DollarSign,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Client, LeadStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getRecommendation, isFollowUpUrgent } from '../lib/crm-logic';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';

interface LeadsListProps {
  clients: Client[];
  onAddLead: () => void;
  onEditLead: (client: Client) => void;
  onViewLead: (client: Client) => void;
  onOpenChat: (client: Client) => void;
  initialFilterUser?: string;
  initialFilterPriority?: boolean;
  onFilterReset?: () => void;
}

export default function LeadsList({ 
  clients, 
  onAddLead, 
  onEditLead, 
  onViewLead, 
  onOpenChat,
  initialFilterUser = 'all',
  initialFilterPriority = false,
  onFilterReset
}: LeadsListProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>(initialFilterUser);
  const [showOnlyPriority, setShowOnlyPriority] = useState(initialFilterPriority);

  React.useEffect(() => {
    setShowOnlyPriority(initialFilterPriority);
  }, [initialFilterPriority]);

  const businessTypes = ["Restaurante", "Cafetería", "Minimarket", "Tienda de ropa", "Otros"];

  const filteredClients = clients.filter(client => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      client.nombreNegocio.toLowerCase().includes(searchLower) || 
      client.nombreContacto.toLowerCase().includes(searchLower) ||
      client.telefono.toLowerCase().includes(searchLower) ||
      (client.email && client.email.toLowerCase().includes(searchLower));
    
    const matchesStatus = filterStatus === 'all' || client.estado === filterStatus;
    const matchesType = filterType === 'all' || client.tipoNegocio === filterType;
    const matchesUser = filterUser === 'all' || client.assignedTo === filterUser || (client as any).assignedToId === filterUser;
    const matchesPriority = !showOnlyPriority || client.closingProbability > 80;
    
    return matchesSearch && matchesStatus && matchesType && matchesUser && matchesPriority;
  });

  const stages: { status: LeadStatus; label: string; icon: any; color: string; bg: string }[] = [
    { status: "Nuevos prospectos", label: "Nuevos Prospectos", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { status: "Contacto inicial", label: "Contacto Inicial", icon: Phone, color: "text-orange-500", bg: "bg-orange-500/10" },
    { status: "Presentación", label: "Presentación POS", icon: Package, color: "text-purple-500", bg: "bg-purple-500/10" },
    { status: "Negociación", label: "En Negociación", icon: DollarSign, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { status: "Propuesta enviada", label: "Propuesta Enviada", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
    { status: "Ganado", label: "Ventas Ganadas", icon: Sparkles, color: "text-success", bg: "bg-success/10" },
    { status: "Perdido", label: "Ventas Perdidas", icon: AlertCircle, color: "text-danger", bg: "bg-danger/10" }
  ];

  const groupedClients = stages.map(stage => ({
    ...stage,
    clients: filteredClients.filter(c => c.estado === stage.status)
  }));

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center border border-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground">Negocios <span className="text-primary italic">POS</span></h2>
          </div>
          <p className="text-muted-foreground font-bold text-lg max-w-2xl">Gestión de prospectos calificados para SmartPOS.</p>
        </div>
        <button onClick={onAddLead} className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-8 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
          <Plus className="w-6 h-6" />
          <span>Registrar Negocio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-card p-6 rounded-[2.5rem] shadow-xl border border-border">
        <div className="relative group md:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Buscar por negocio..." 
            className="pl-11 h-14 bg-muted/50 border-border rounded-2xl focus-visible:ring-primary focus-visible:bg-background transition-all font-bold text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="h-14 bg-muted/50 border-border rounded-2xl font-black text-foreground uppercase tracking-wider text-[11px] shadow-sm hover:border-primary transition-all focus:bg-background">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <SelectValue placeholder="Tipo de negocio" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border shadow-2xl bg-card">
            <SelectItem value="all" className="font-bold text-foreground">Todos los negocios</SelectItem>
            {businessTypes.map(t => (
              <SelectItem key={t} value={t} className="font-bold">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="h-14 bg-muted/50 border-border rounded-2xl font-black text-foreground uppercase tracking-wider text-[11px] shadow-sm hover:border-primary transition-all focus:bg-background">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <SelectValue placeholder="Filtrar por Asesor" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border shadow-2xl bg-card">
            <SelectItem value="all" className="font-bold text-foreground">Todos los asesores</SelectItem>
            {USERS.map(u => (
              <SelectItem key={u.id} value={u.id} className="font-bold">{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant={showOnlyPriority ? "default" : "outline"}
          onClick={() => {
            const newVal = !showOnlyPriority;
            setShowOnlyPriority(newVal);
            if (!newVal && onFilterReset) onFilterReset();
          }}
          className={cn(
            "h-14 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all",
            showOnlyPriority ? "shadow-lg shadow-primary/20" : "bg-muted/50"
          )}
        >
          <Sparkles className={cn("w-4 h-4 mr-2", showOnlyPriority ? "text-white" : "text-primary")} />
          Prioritarios
        </Button>
      </div>

      <div className="space-y-16">
        {groupedClients.map((stage) => (
          <section key={stage.status} className="space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className={cn("w-12 h-12 rounded-[1.25rem] flex items-center justify-center border-2 border-transparent shadow-lg transition-all", stage.bg, stage.color)}>
                <stage.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-black tracking-tight text-foreground">{stage.label}</h3>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stage.clients.length} oportunidades activas</span>
              </div>
              <div className="flex-grow h-px bg-gradient-to-r from-border to-transparent ml-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-2">
              {stage.clients.length > 0 ? (
                stage.clients.map((client) => {
                  const isUrgent = isFollowUpUrgent(client.proximoSeguimiento);
                  
                  return (
                    <Card 
                      key={client.id}
                      className="bg-card border border-border rounded-[2.5rem] overflow-hidden group cursor-pointer hover:shadow-2xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                      onClick={() => onViewLead(client)}
                    >
                      <div className="p-8 pb-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">{client.tipoNegocio}</span>
                            <CardTitle className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">{client.nombreNegocio}</CardTitle>
                          </div>
                          <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider", stage.bg, stage.color)}>
                            {stage.status}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground font-black text-xs uppercase tracking-widest pt-2 border-t border-border/50">
                          <UserIcon className="w-4 h-4 text-primary" />
                          {client.nombreContacto}
                        </div>
                      </div>

                      <CardContent className="px-8 pb-4 flex-grow space-y-5">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-4 text-sm text-foreground font-bold p-3 bg-muted/30 rounded-2xl group-hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border">
                              <Phone className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5">Teléfono</span>
                              <span className="table-text">{client.telefono}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-foreground font-bold p-3 bg-muted/30 rounded-2xl group-hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border">
                              <CalendarIcon className={cn("w-4 h-4", isUrgent ? "text-rose-500" : "text-blue-500")} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5">Seguimiento</span>
                              <span className={cn("table-text", isUrgent && "text-rose-500")}>
                                {(() => {
                                  const dateStr = typeof client.proximoSeguimiento === 'string' ? client.proximoSeguimiento : (client.proximoSeguimiento as any).toISOString();
                                  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {client.necesidadDetectada && (
                          <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                              <Sparkles className="w-3 h-3" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Necesidad</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                              {client.necesidadDetectada}
                            </p>
                          </div>
                        )}
                      </CardContent>

                      <div className="px-8 pb-8 flex items-center justify-between border-t border-border/30 pt-6 mt-auto">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary">{client.closingProbability}% Cierre</span>
                        </div>
                        <div className="flex gap-2">
                          <Select 
                            onValueChange={(val) => {
                              onEditLead({ ...client, estado: val as LeadStatus });
                            }}
                          >
                            <SelectTrigger className="w-10 h-10 rounded-xl bg-primary/10 border-none flex items-center justify-center p-0 hover:bg-primary/20 transition-all">
                              <TrendingUp className="w-5 h-5 text-primary" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border shadow-2xl bg-card">
                              {stages.map(s => (
                                <SelectItem key={s.status} value={s.status} className="font-bold">{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewLead(client);
                            }}
                          >
                            <MessageSquare className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-muted/50 flex items-center justify-center mb-4">
                    <stage.icon className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Sin prospectos en esta etapa</p>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-20 text-center space-y-6">
          <div className="w-32 h-32 rounded-[2.5rem] bg-muted flex items-center justify-center shadow-inner">
            <Search className="w-12 h-12 text-muted-foreground/20" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-foreground">Sin resultados</h3>
            <p className="text-muted-foreground font-bold max-w-sm mx-auto uppercase tracking-wider text-xs">No se encontraron negocios con los filtros aplicados.</p>
          </div>
        </div>
      )}
    </div>
  );
}
