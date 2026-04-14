
import React from 'react';
import { motion } from 'motion/react';
import { Client, LeadStatus } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Phone, 
  Building2, 
  Users, 
  ChevronRight, 
  MoreVertical, 
  TrendingUp, 
  User as UserIcon, 
  Filter,
  AlertCircle,
  Search,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';
import { isStagnant } from '../lib/crm-logic';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface KanbanCardProps {
  client: Client;
  status: LeadStatus;
  onViewLead: (c: Client) => void;
  isOverlay?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ client, status, onViewLead, isOverlay = false }) => {
  const assignedUser = USERS.find(u => u.id === client.assignedTo);
  const stagnant = isStagnant(client.ultimoContacto, 5);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: client.id, data: { client, status } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("group cursor-grab active:cursor-grabbing", isOverlay && "cursor-grabbing")}
      onClick={() => !isOverlay && onViewLead(client)}
    >
      <Card className={cn(
        "bg-card border-border hover:border-primary/50 overflow-hidden rounded-[1.8rem] shadow-sm hover:shadow-md transition-all duration-300",
        isOverlay && "shadow-2xl border-primary ring-2 ring-primary/20"
      )}>
        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-[9px] font-black text-primary border border-primary/10">
                {assignedUser?.avatar}
              </div>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{assignedUser?.name.split(' ')[0]}</span>
            </div>
            {stagnant && (
              <Badge className="bg-danger/10 text-danger border-none font-black text-[8px] uppercase tracking-widest flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-2.5 h-2.5" />
                Estancado
              </Badge>
            )}
          </div>
          
          <div>
            <h4 className="font-black text-foreground text-sm leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">{client.nombreNegocio}</h4>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {client.tipoNegocio}
              </p>
              <div className="text-[11px] font-black text-foreground">
                ${client.presupuestoEstimado.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Probabilidad</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", STATUS_COLORS[status])} 
                      style={{ width: `${client.closingProbability}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary">{client.closingProbability}%</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function KanbanBoard({ clients, onMoveLead, onViewLead, currentUserId }: KanbanBoardProps) {
  const [advisorFilter, setAdvisorFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [businessTypeFilter, setBusinessTypeFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeClient, setActiveClient] = React.useState<Client | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredClients = clients.filter(c => {
    const matchesAdvisor = advisorFilter === 'all' || c.assignedTo === advisorFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'open' && c.estado !== 'Venta cerrada') ||
                         (statusFilter === 'closed' && c.estado === 'Venta cerrada');
    const matchesBusinessType = businessTypeFilter === 'all' || c.tipoNegocio === businessTypeFilter;
    const matchesSearch = c.nombreNegocio.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.nombreContacto.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAdvisor && matchesStatus && matchesBusinessType && matchesSearch;
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const client = clients.find(c => c.id === active.id);
    if (client) setActiveClient(client);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveClient(null);

    if (over && active.id !== over.id) {
      const newStatus = over.id as LeadStatus;
      if (COLUMNS.includes(newStatus)) {
        onMoveLead(active.id as string, newStatus);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id;
    // Logic for moving between columns if needed, but onMoveLead handles it on drag end
  };

  const totalPipelineValue = filteredClients.reduce((acc, c) => acc + c.presupuestoEstimado, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-foreground">Pipeline <span className="text-primary">Comercial</span></h2>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="rounded-lg font-black text-[10px] uppercase tracking-widest border-primary/20 text-primary bg-primary/5 px-3 py-1">
              Total: ${totalPipelineValue.toLocaleString()} COP
            </Badge>
            <Badge variant="outline" className="rounded-lg font-black text-[10px] uppercase tracking-widest border-border text-muted-foreground bg-muted/50 px-3 py-1">
              {filteredClients.length} Oportunidades
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Búsqueda</Label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Negocio o contacto..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-11 w-[200px] md:w-[240px] rounded-2xl bg-card border-border focus-visible:ring-primary font-bold text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Asesor</Label>
            <Select value={advisorFilter} onValueChange={setAdvisorFilter}>
              <SelectTrigger className="w-[160px] h-11 rounded-2xl bg-card border-border font-bold text-xs">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Cualquier asesor" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border shadow-xl bg-card">
                <SelectItem value="all" className="font-bold text-xs italic text-muted-foreground">Cualquier asesor</SelectItem>
                {USERS.map(user => (
                  <SelectItem key={user.id} value={user.id} className="font-bold text-xs">
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Estado</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-11 rounded-2xl bg-card border-border font-bold text-xs">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Cualquier estado" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border shadow-xl bg-card">
                <SelectItem value="all" className="font-bold text-xs italic text-muted-foreground">Cualquier estado</SelectItem>
                <SelectItem value="open" className="font-bold text-xs">Abiertos</SelectItem>
                <SelectItem value="closed" className="font-bold text-xs">Cerrados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tipo de Negocio</Label>
            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger className="w-[160px] h-11 rounded-2xl bg-card border-border font-bold text-xs">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Cualquier tipo" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border shadow-xl bg-card">
                <SelectItem value="all" className="font-bold text-xs italic text-muted-foreground">Cualquier tipo</SelectItem>
                <SelectItem value="Restaurante" className="font-bold text-xs">Restaurante</SelectItem>
                <SelectItem value="Cafetería" className="font-bold text-xs">Cafetería</SelectItem>
                <SelectItem value="Minimarket" className="font-bold text-xs">Minimarket</SelectItem>
                <SelectItem value="Tienda de ropa" className="font-bold text-xs">Tienda de ropa</SelectItem>
                <SelectItem value="Otros" className="font-bold text-xs">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden xl:flex items-center gap-3 bg-card px-5 py-2.5 rounded-2xl border border-border shadow-sm h-11 mb-0">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">En Vivo</span>
          </div>
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
          {COLUMNS.map((status) => {
            const columnClients = filteredClients.filter(c => c.estado === status);
            const columnValue = columnClients.reduce((acc, c) => acc + c.presupuestoEstimado, 0);
            const avgProb = columnClients.length > 0 
              ? Math.round(columnClients.reduce((acc, c) => acc + c.closingProbability, 0) / columnClients.length)
              : 0;

            return (
              <div key={status} className="min-w-[320px] w-[320px] flex flex-col gap-4">
                {/* Column Header */}
                <div className="p-5 rounded-[2rem] bg-card border border-border shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2.5 h-2.5 rounded-full", STATUS_COLORS[status])} />
                      <h3 className="font-black text-foreground text-[11px] uppercase tracking-[0.15em] truncate max-w-[140px]">{status}</h3>
                    </div>
                    <Badge className="bg-muted text-muted-foreground border-none font-black text-[10px] px-2 py-0.5">
                      {columnClients.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Valor Etapa</span>
                      <span className="text-xs font-black text-foreground">${columnValue.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Prob. Media</span>
                      <span className="text-xs font-black text-primary">{avgProb}%</span>
                    </div>
                  </div>
                </div>

                {/* Column Content */}
                <SortableContext 
                  id={status}
                  items={columnClients.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div 
                    className="flex-1 space-y-4 min-h-[500px] p-2 rounded-[2.5rem] bg-muted/30 border border-dashed border-border/50"
                  >
                    {columnClients.map((client) => (
                      <KanbanCard 
                        key={client.id} 
                        client={client} 
                        status={status} 
                        onViewLead={onViewLead} 
                      />
                    ))}
                    {columnClients.length === 0 && (
                      <div className="h-32 border-2 border-dashed border-border/30 rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground/40">
                        <p className="text-[9px] font-black uppercase tracking-widest">Vacío</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeClient ? (
            <KanbanCard 
              client={activeClient} 
              status={activeClient.estado} 
              onViewLead={onViewLead} 
              isOverlay 
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
