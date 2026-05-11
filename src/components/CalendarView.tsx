import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  MoreVertical,
  CalendarDays,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  User as UserIcon,
  Trash2,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CalendarEvent, User } from '../types';
import { USERS } from '../constants';
import { toast } from 'sonner';

interface CalendarViewProps {
  currentUser: User;
}

const VIEW_MODES = ['Month', 'Week', 'Day'] as const;
type ViewMode = typeof VIEW_MODES[number];

export default function CalendarView({ currentUser }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // State for new/editing event
  const [eventForm, setEventForm] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    type: 'meeting',
    priority: 'medium',
    status: 'pending',
    attendees: ['u1']
  });

  // Simulated events for the enterprise demo
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'e1',
      title: 'Demo POS - Juan Valdez',
      description: 'Presentación de propuesta técnica y comercial.',
      start: new Date(new Date().setHours(10, 0)).toISOString(),
      end: new Date(new Date().setHours(11, 30)).toISOString(),
      type: 'meeting',
      priority: 'high',
      status: 'confirmed',
      attendees: ['u1', 'u2'],
      userId: 'u1'
    },
    {
      id: 'e2',
      title: 'Seguimiento Minimarket El Sol',
      description: 'Llamada para resolver dudas sobre hardware.',
      start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      type: 'followup',
      priority: 'medium',
      status: 'pending',
      attendees: ['u1'],
      userId: 'u1'
    },
    {
      id: 'e3',
      title: 'Reunión Equipo Q2',
      description: 'Ajuste de metas y revisión de pipeline.',
      start: new Date(new Date().setHours(14, 0)).toISOString(),
      end: new Date(new Date().setHours(15, 0)).toISOString(),
      type: 'event',
      priority: 'low',
      status: 'confirmed',
      attendees: ['u1', 'u2', 'u3', 'u4'],
      userId: 'u1'
    }
  ]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const calendarDays = [];
    // Previous month padding
    for (let i = 0; i < startDay; i++) {
      calendarDays.push({ day: null, date: null });
    }
    // Current month days
    for (let i = 1; i <= days; i++) {
      const date = new Date(year, month, i);
      calendarDays.push({ day: i, date });
    }
    return calendarDays;
  }, [currentDate]);

  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter(e => new Date(e.start) >= new Date())
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [events]);

  const handleSaveEvent = () => {
    if (!eventForm.title) {
      toast.error("El título es obligatorio");
      return;
    }

    if (selectedEvent) {
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, ...eventForm } as CalendarEvent : e));
      toast.success("Evento actualizado");
    } else {
      const newEvent: CalendarEvent = {
        ...(eventForm as Omit<CalendarEvent, 'id' | 'userId'>),
        id: `e${Date.now()}`,
        userId: currentUser.id
      };
      setEvents(prev => [...prev, newEvent]);
      toast.success("Evento creado");
    }
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventForm(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success("Evento eliminado");
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setEventForm({
      title: '',
      description: '',
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      type: 'meeting',
      priority: 'medium',
      status: 'pending',
      attendees: [currentUser.id]
    });
    setIsEventModalOpen(true);
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      const eventDate = new Date(e.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const handleSyncGoogle = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Sincronizando con Google Calendar...',
        success: 'Calendario sincronizado exitosamente',
        error: 'Error al sincronizar'
      }
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Left Column: Calendar Main Area */}
      <div className="flex-1 flex flex-col gap-6">
        <Card className="glass-card border-none rounded-[2.5rem] shadow-xl overflow-hidden flex-1 flex flex-col">
          <CardHeader className="p-8 border-b border-border bg-card/50 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">
                    {currentDate.toLocaleString('es-CO', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">En Sincronización</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 p-1 bg-muted rounded-2xl border border-border">
                {VIEW_MODES.map(mode => (
                  <Button
                    key={mode}
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "rounded-xl text-[10px] font-black uppercase tracking-widest px-4 h-8 transition-all",
                      viewMode === mode ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex gap-1 mr-2">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl h-10 w-10 hover:bg-muted">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="rounded-xl px-4 text-xs font-bold uppercase tracking-widest">
                  Hoy
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl h-10 w-10 hover:bg-muted">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              <Button onClick={handleSyncGoogle} variant="outline" className="rounded-xl border-border font-black text-[10px] uppercase tracking-widest h-10 px-4 gap-2 hover:border-primary transition-all">
                <ExternalLink className="w-3 h-3 text-primary" />
                Google Sync
              </Button>
              <Button onClick={handleNewEvent} className="rounded-xl bg-primary hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest h-10 px-4 gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                Nuevo Evento
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex flex-col">
            {viewMode === 'Month' ? (
              <div className="grid grid-cols-7 flex-1">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} className="p-4 border-b border-border text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {d}
                  </div>
                ))}
                {monthData.map((data, i) => {
                  const dayEvents = data.date ? getEventsForDate(data.date) : [];
                  const isToday = data.date && data.date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "min-h-[120px] p-2 border-r border-b border-border/50 group transition-all",
                        i % 7 === 6 && "border-r-0",
                        !data.day && "bg-muted/30 opacity-50"
                      )}
                    >
                      {data.day && (
                        <div className="flex flex-col h-full gap-1">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-all",
                            isToday ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground group-hover:bg-muted"
                          )}>
                            {data.day}
                          </div>
                          <div className="flex-1 space-y-1">
                            {dayEvents.map(event => (
                              <div 
                                key={event.id}
                                onClick={() => handleEditEvent(event)}
                                className={cn(
                                  "group/event relative px-2 py-1.5 rounded-lg text-[10px] font-bold truncate transition-all cursor-pointer",
                                  event.priority === 'high' ? "bg-rose-500/10 text-rose-500 border-l-2 border-rose-500" :
                                  event.priority === 'medium' ? "bg-amber-500/10 text-amber-500 border-l-2 border-amber-500" :
                                  "bg-emerald-500/10 text-emerald-500 border-l-2 border-emerald-500"
                                )}
                              >
                                {event.title}
                                <div className="absolute inset-0 bg-black/5 rounded-lg opacity-0 group-hover/event:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : viewMode === 'Week' ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="grid grid-cols-8 border-b border-border bg-muted/20">
                  <div className="p-3 border-r border-border" />
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                    <div key={d} className="p-3 text-center text-[10px] font-black text-muted-foreground uppercase border-r border-border last:border-r-0">
                      {d}
                    </div>
                  ))}
                </div>
                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-8 relative">
                    {/* Time labels */}
                    <div className="flex flex-col">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="h-20 border-r border-b border-border p-2 text-[10px] font-bold text-muted-foreground">
                          {i}:00
                        </div>
                      ))}
                    </div>
                    {/* Days columns */}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="flex flex-col border-r border-border last:border-r-0 relative group">
                        {Array.from({ length: 24 }).map((_, j) => (
                          <div key={j} className="h-20 border-b border-border/50 group-hover:bg-muted/5 transition-colors" />
                        ))}
                        {/* Events overlay for this day - simplified for demo */}
                        {events.slice(0, 1).map(e => (
                          <div 
                            key={e.id}
                            onClick={() => handleEditEvent(e)}
                            className="absolute left-1 right-1 top-40 h-24 bg-primary/20 border-l-4 border-primary rounded-xl p-2 cursor-pointer hover:bg-primary/30 transition-all z-10"
                          >
                            <p className="text-[10px] font-black leading-tight">{e.title}</p>
                            <p className="text-[8px] font-bold text-muted-foreground">10:00 - 11:30</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border text-center font-black text-primary uppercase tracking-widest bg-primary/5">
                  {currentDate.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <ScrollArea className="flex-1">
                  <div className="flex relative">
                    <div className="w-20 shrink-0">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="h-24 border-r border-b border-border p-4 text-xs font-bold text-muted-foreground">
                          {i}:00
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 relative group">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="h-24 border-b border-border/50 group-hover:bg-muted/5" />
                      ))}
                      {/* Day events overlay */}
                      {getEventsForDate(currentDate).map((e, idx) => (
                        <div 
                          key={e.id}
                          onClick={() => handleEditEvent(e)}
                          style={{ top: `${idx * 100 + 40}px` }}
                          className="absolute left-4 right-4 h-20 bg-primary/20 border-l-4 border-primary rounded-[1.5rem] p-4 cursor-pointer hover:scale-[1.02] transition-all"
                        >
                          <h4 className="font-black text-sm">{e.title}</h4>
                          <p className="text-xs font-medium opacity-70 line-clamp-1">{e.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        {/* Search */}
        <Card className="glass-card border-none rounded-[2.5rem] shadow-xl overflow-hidden shrink-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar eventos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-muted border-none text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events List */}
        <Card className="glass-card border-none rounded-[2.5rem] border border-border shadow-xl overflow-hidden flex-1 flex flex-col">
          <CardHeader className="p-8 border-b border-border bg-card">
            <CardTitle className="text-xl font-black text-foreground">Agenda Próxima</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">Eventos críticos para esta semana.</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="group relative flex gap-4 p-4 rounded-3xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all cursor-pointer">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm",
                    event.priority === 'high' ? "bg-danger/10 text-danger" : 
                    event.priority === 'medium' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                  )}>
                    <span className="text-[10px] font-black uppercase">{new Date(event.start).toLocaleDateString('es', { weekday: 'short' })}</span>
                    <span className="text-lg font-black leading-none">{new Date(event.start).getDate()}</span>
                  </div>
                  
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <h4 className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{event.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {event.attendees.length > 0 && (
                      <div className="flex -space-x-2 pt-2">
                        {event.attendees.map(uid => (
                          <div key={uid} className="w-6 h-6 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-[8px] font-black text-primary overflow-hidden">
                            {USERS.find(u => u.id === uid)?.avatar}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-primary/10">
                      <MoreVertical className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto opacity-50">
                    <Zap className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground italic">No hay eventos próximos.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-8 border-t border-border bg-card/30">
            <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">KPI Semanal</p>
                <p className="text-xs font-bold text-foreground">85% Reuniones Completadas</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Event Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-border shadow-2xl p-0 overflow-hidden">
          <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                {selectedEvent ? 'Editar Evento' : 'Nuevo Evento Comercial'}
                {selectedEvent && (
                  <Badge variant="outline" className={cn(
                    "font-black text-[10px] uppercase border-none",
                    selectedEvent.priority === 'high' ? "bg-rose-500/20 text-rose-500" :
                    selectedEvent.priority === 'medium' ? "bg-amber-500/20 text-amber-500" :
                    "bg-emerald-500/20 text-emerald-500"
                  )}>
                    {selectedEvent.priority}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold">
                Gestiona tus reuniones y seguimientos de venta.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Título del Evento</label>
                <Input 
                  value={eventForm.title}
                  onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Demo POS - Cliente X"
                  className="rounded-2xl border-border bg-muted/30 font-bold h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Tipo de Evento</label>
                  <Select 
                    value={eventForm.type} 
                    onValueChange={v => setEventForm(prev => ({ ...prev, type: v as any }))}
                  >
                    <SelectTrigger className="rounded-2xl border-border bg-muted/30 font-bold h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border shadow-xl">
                      <SelectItem value="meeting">Reunión</SelectItem>
                      <SelectItem value="followup">Seguimiento</SelectItem>
                      <SelectItem value="call">Llamada</SelectItem>
                      <SelectItem value="event">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Prioridad</label>
                  <Select 
                    value={eventForm.priority} 
                    onValueChange={v => setEventForm(prev => ({ ...prev, priority: v as any }))}
                  >
                    <SelectTrigger className="rounded-2xl border-border bg-muted/30 font-bold h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border shadow-xl">
                      <SelectItem value="high" className="text-rose-500 font-bold">Alta</SelectItem>
                      <SelectItem value="medium" className="text-amber-500 font-bold">Media</SelectItem>
                      <SelectItem value="low" className="text-emerald-500 font-bold">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Descripción / Notas</label>
                <Textarea 
                  value={eventForm.description}
                  onChange={e => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detalles adicionales..."
                  className="rounded-2xl border-border bg-muted/30 font-bold min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Participantes</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {USERS.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        const attendees = eventForm.attendees || [];
                        if (attendees.includes(user.id)) {
                          setEventForm(prev => ({ ...prev, attendees: attendees.filter(id => id !== user.id) }));
                        } else {
                          setEventForm(prev => ({ ...prev, attendees: [...attendees, user.id] }));
                        }
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all",
                        (eventForm.attendees || []).includes(user.id) 
                          ? "bg-primary/10 border-primary text-primary shadow-sm" 
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <span className="text-sm">{user.avatar}</span>
                      {user.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-muted/30 border-t border-border flex items-center justify-between sm:justify-between">
            {selectedEvent && (
              <Button 
                variant="ghost" 
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="rounded-xl text-rose-500 hover:bg-rose-500/10 h-12 px-6 font-black text-xs uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button 
                variant="ghost" 
                onClick={() => setIsEventModalOpen(false)}
                className="rounded-xl h-12 px-6 font-black text-xs uppercase tracking-widest"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveEvent}
                className="rounded-xl bg-primary hover:bg-primary/90 h-12 px-8 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                {selectedEvent ? 'Guardar Cambios' : 'Crear Evento'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
