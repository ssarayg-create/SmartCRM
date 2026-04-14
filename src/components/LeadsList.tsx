
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
  User as UserIcon
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
}

export default function LeadsList({ 
  clients, 
  onAddLead, 
  onEditLead, 
  onViewLead, 
  onOpenChat,
  initialFilterUser = 'all'
}: LeadsListProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>(initialFilterUser);

  const filteredClients = clients.filter(client => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      client.nombreNegocio.toLowerCase().includes(searchLower) || 
      client.nombreContacto.toLowerCase().includes(searchLower) ||
      client.telefono.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === 'all' || client.estado === filterStatus;
    const matchesUser = filterUser === 'all' || client.assignedTo === filterUser;
    return matchesSearch && matchesStatus && matchesUser;
  });

  const getStatusBadge = (status: LeadStatus) => {
    const config: Record<LeadStatus, { color: string, bg: string, label: string }> = {
      "Nuevo lead": { color: "text-muted-foreground", bg: "bg-muted", label: "Nuevo" },
      "Contacto inicial": { color: "text-blue-500", bg: "bg-blue-500/10", label: "Contacto" },
      "Demo del sistema POS": { color: "text-indigo-500", bg: "bg-indigo-500/10", label: "Demo" },
      "Envío de propuesta": { color: "text-secondary", bg: "bg-secondary/10", label: "Propuesta" },
      "Negociación": { color: "text-warning", bg: "bg-warning/10", label: "Negociación" },
      "Venta cerrada": { color: "text-success", bg: "bg-success/10", label: "Cerrado" }
    };
    const s = config[status] || config["Nuevo lead"];
    return <Badge variant="secondary" className={cn("font-black text-[10px] uppercase tracking-wider border-none", s.bg, s.color)}>{s.label}</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Gestión de <span className="text-primary">Negocios</span></h2>
          <p className="text-muted-foreground mt-1 font-semibold text-lg">Administra tus prospectos POS y realiza seguimientos inteligentes.</p>
        </div>
        <button onClick={onAddLead} className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-5 h-5" />
          <span>Nuevo Negocio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-card p-5 rounded-[2rem] shadow-sm border border-border">
        <div className="relative group lg:col-span-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Buscar por negocio o contacto..." 
            className="pl-11 h-12 bg-muted border-border rounded-2xl focus-visible:ring-primary focus-visible:bg-card transition-all font-bold text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-12 bg-muted border-border rounded-2xl font-black text-foreground uppercase tracking-wider text-[10px] shadow-sm hover:border-primary transition-colors">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border shadow-xl bg-card">
            <SelectItem value="all" className="font-bold text-foreground">Estado</SelectItem>
            <SelectItem value="Nuevo lead" className="text-foreground">Nuevo lead</SelectItem>
            <SelectItem value="Contacto inicial" className="text-foreground">Contacto inicial</SelectItem>
            <SelectItem value="Demo del sistema POS" className="text-foreground">Demo POS</SelectItem>
            <SelectItem value="Envío de propuesta" className="text-foreground">Envío de propuesta</SelectItem>
            <SelectItem value="Negociación" className="text-foreground">Negociación</SelectItem>
            <SelectItem value="Venta cerrada" className="text-foreground">Venta cerrada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="h-12 bg-muted border-border rounded-2xl font-black text-foreground uppercase tracking-wider text-[10px] shadow-sm hover:border-primary transition-colors">
            <SelectValue placeholder="Vendedores" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border shadow-xl bg-card">
            <SelectItem value="all" className="font-bold text-foreground">Vendedores</SelectItem>
            {USERS.map(u => (
              <SelectItem key={u.id} value={u.id} className="text-foreground">{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredClients.map((client) => {
          const recommendation = getRecommendation(client.tipoNegocio);
          const isUrgent = isFollowUpUrgent(client.proximoSeguimiento);
          const assignedUser = USERS.find(u => u.id === client.assignedTo);
          
          return (
            <Card 
              key={client.id} 
              className="glass-card border-none overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => onViewLead(client)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  {getStatusBadge(client.estado)}
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditLead(client);
                      }}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{client.nombreNegocio}</CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <CardDescription className="flex items-center gap-1.5 text-muted-foreground font-bold">
                    <UserIcon className="w-3.5 h-3.5" />
                    {client.nombreContacto}
                  </CardDescription>
                  <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest">
                    <TrendingUp className="w-3 h-3" />
                    {client.closingProbability}% Prob.
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pb-5">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-bold bg-muted/50 p-3 rounded-2xl border border-border">
                    <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center shadow-sm">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    {client.telefono}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-bold bg-muted/50 p-3 rounded-2xl border border-border">
                    <div className="w-8 h-8 rounded-xl bg-card flex items-center justify-center shadow-sm">
                      <MapPin className="w-4 h-4 text-secondary" />
                    </div>
                    {client.ciudad}
                  </div>
                </div>

                <div className={cn(
                  "p-4 rounded-2xl flex items-center justify-between transition-all",
                  isUrgent ? "bg-rose-500/10 border border-rose-500/20" : "bg-muted border border-border"
                )}>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className={cn("w-4 h-4", isUrgent ? "text-rose-500" : "text-muted-foreground")} />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", isUrgent ? "text-rose-500" : "text-muted-foreground")}>
                      Seguimiento
                    </span>
                  </div>
                  <span className={cn("text-sm font-black", isUrgent ? "text-rose-500" : "text-foreground")}>
                    {(() => {
                      const [y, m, d] = client.proximoSeguimiento.split('T')[0].split('-').map(Number);
                      return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
                    })()}
                  </span>
                </div>

                <div className="bg-slate-950 rounded-[2rem] p-5 text-white relative overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -mr-12 -mt-12 blur-2xl" />
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">IA Recommendation</span>
                  </div>
                  <p className="text-sm font-bold leading-snug">
                    {recommendation.recomendar}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-6 px-6">
                <Button 
                  className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-black h-12 transition-all" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewLead(client);
                  }}
                >
                  Ver Detalles
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
