
import React from 'react';
import { motion } from 'motion/react';
import { Client, LeadStatus } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Building2, Users, ChevronRight, MoreVertical, TrendingUp, User as UserIcon, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';

interface KanbanBoardProps {
  clients: Client[];
  onMoveLead: (clientId: string, newStatus: LeadStatus) => void;
  onViewLead: (client: Client) => void;
  currentUserId: string;
}

const COLUMNS: LeadStatus[] = [
  "Nuevo lead", 
  "Contacto inicial", 
  "Demo del sistema POS", 
  "Envío de propuesta", 
  "Negociación", 
  "Venta cerrada"
];

const STATUS_COLORS: Record<LeadStatus, string> = {
  "Nuevo lead": "bg-slate-400",
  "Contacto inicial": "bg-blue-500",
  "Demo del sistema POS": "bg-indigo-500",
  "Envío de propuesta": "bg-secondary",
  "Negociación": "bg-warning",
  "Venta cerrada": "bg-success"
};

export default function KanbanBoard({ clients, onMoveLead, onViewLead, currentUserId }: KanbanBoardProps) {
  const [onlyMyLeads, setOnlyMyLeads] = React.useState(true);

  const filteredClients = onlyMyLeads 
    ? clients.filter(c => c.assignedTo === currentUserId)
    : clients;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Pipeline <span className="text-primary">POS</span></h2>
          <p className="text-muted-foreground mt-2 font-semibold text-lg">Gestiona el flujo de tus oportunidades comerciales de sistemas POS.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setOnlyMyLeads(!onlyMyLeads)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest shadow-sm",
              onlyMyLeads 
                ? "bg-primary text-white border-primary shadow-primary/20" 
                : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            {onlyMyLeads ? 'Mis Negocios' : 'Todos los Negocios'}
          </button>
          <div className="hidden md:flex items-center gap-3 bg-card px-5 py-2.5 rounded-2xl border border-border shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Sincronizado</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {COLUMNS.map((status) => {
          const columnClients = filteredClients.filter(c => c.estado === status);
          if (columnClients.length === 0 && (status === "Venta cerrada")) return null;

          return (
            <div key={status} className="space-y-6">
              <div className="flex items-center justify-between px-8 py-4 bg-card rounded-[2rem] border border-border shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={cn("w-3 h-3 rounded-full shadow-sm", STATUS_COLORS[status])} />
                  <h3 className="font-black text-foreground text-sm uppercase tracking-[0.2em]">{status}</h3>
                  <span className="text-[10px] font-black text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                    {columnClients.length} {columnClients.length === 1 ? 'Negocio' : 'Negocios'}
                  </span>
                </div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Valor Estimado: ${(columnClients.reduce((acc, c) => acc + c.presupuestoEstimado, 0)).toLocaleString()} COP
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {columnClients.map((client) => {
                  const assignedUser = USERS.find(u => u.id === client.assignedTo);
                  return (
                    <motion.div
                      key={client.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group cursor-pointer"
                      onClick={() => onViewLead(client)}
                    >
                      <Card className="glass-card border-none overflow-hidden h-full rounded-[2rem] group-hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 space-y-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                {assignedUser?.avatar}
                              </div>
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{assignedUser?.name.split(' ')[0]}</span>
                            </div>
                            <div className="flex gap-2">
                              {COLUMNS.indexOf(status) < COLUMNS.length - 1 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMoveLead(client.id, COLUMNS[COLUMNS.indexOf(status) + 1]);
                                  }}
                                  className="w-10 h-10 rounded-2xl bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
                                  title="Avanzar etapa"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-black text-foreground text-xl leading-tight tracking-tight group-hover:text-primary transition-colors">{client.nombreNegocio}</h4>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                                <UserIcon className="w-3.5 h-3.5" />
                                {client.nombreContacto}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest">
                                <TrendingUp className="w-3 h-3" />
                                {client.closingProbability}%
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                <Phone className="w-3.5 h-3.5 text-primary" />
                                {client.telefono}
                              </div>
                              <div className={cn(
                                "flex items-center gap-2 text-[10px] font-black px-3 py-1 rounded-full",
                                new Date(client.proximoSeguimiento) <= new Date() 
                                  ? "text-danger bg-danger/10" 
                                  : "text-muted-foreground bg-muted"
                              )}>
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(client.proximoSeguimiento).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                              </div>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full transition-all duration-1000", STATUS_COLORS[status])} 
                                style={{ width: `${client.closingProbability}%` }} 
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
                {columnClients.length === 0 && (
                  <div className="col-span-full py-12 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
                    <p className="text-[10px] font-black uppercase tracking-widest">Sin negocios en esta etapa</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
