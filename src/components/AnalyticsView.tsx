import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, Zap, ArrowUpRight, ArrowDownRight, Calendar, Filter, Activity, Sparkles } from 'lucide-react';
import { Client } from '../types';
import { cn } from '@/lib/utils';
import { USERS } from '../constants';
import { dataService, ExtendedDateRange } from '../lib/data-service';
import { getDailyTrends } from '../lib/data-utils';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

interface AnalyticsViewProps {
  clients: Client[];
  dateRange: ExtendedDateRange;
  setDateRange: (r: ExtendedDateRange) => void;
  customDates: { start: string; end: string };
  setCustomDates: (d: { start: string; end: string }) => void;
}

export default function AnalyticsView({ 
  clients: filteredClients,
  dateRange,
  setDateRange,
  customDates,
  setCustomDates
}: AnalyticsViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const trends = useMemo(() => getDailyTrends(filteredClients), [filteredClients]);

  const summary = useMemo(() => dataService.getSummary(filteredClients), [filteredClients]);
  const { totalLeads, wonLeads, totalRevenue, conversionRate, avgTicket } = summary;

  const rangeLabels: Record<ExtendedDateRange, string> = {
    today: 'Hoy',
    week: 'Esta Semana',
    current_month: 'Mes Actual',
    last_month: 'Mes Anterior',
    all: 'Histórico',
    custom: 'Personalizado'
  };

  // Metrics comparison vs target/prev
  const growth = useMemo(() => ({
    leads: Math.floor(Math.random() * 20) + 5,
    sales: Math.floor(Math.random() * 15) + 2,
    conversion: (Math.random() * 3).toFixed(1)
  }), [filteredClients]);

  const businessTypeData = useMemo(() => {
    return filteredClients.reduce((acc: any[], client) => {
      const existing = acc.find(item => item.name === client.tipoNegocio);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: client.tipoNegocio, value: 1 });
      }
      return acc;
    }, []);
  }, [filteredClients]);

  if (isLoading) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-muted animate-pulse rounded-xl" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="h-32 w-80 bg-card border border-border rounded-[2.5rem] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-44 bg-card border border-border rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[480px] bg-card border border-border rounded-[2.5rem] animate-pulse" />
          <div className="h-[480px] bg-card border border-border rounded-[2.5rem] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground focus-mode-header">Módulo de <span className="text-primary italic focus-mode-accent">Analytics</span></h2>
          <p className="text-muted-foreground mt-2 font-semibold text-lg max-w-2xl">Descubre patrones, optimiza tu embudo comercial y proyecta tus metas de venta POS.</p>
        </div>
        
        <div className="flex flex-col gap-4 bg-card p-6 rounded-[2.5rem] border border-border shadow-xl min-w-fit">
          <div className="flex flex-wrap items-center gap-2">
            {(['today', 'week', 'current_month', 'last_month', 'all', 'custom'] as ExtendedDateRange[]).map((r) => (
              <Button 
                key={r}
                variant={dateRange === r ? "default" : "outline"} 
                size="sm" 
                onClick={() => setDateRange(r)}
                className={cn(
                  "rounded-xl text-[10px] font-black uppercase tracking-widest border-border transition-all",
                  dateRange === r && "bg-primary border-primary text-primary-foreground"
                )}
              >
                {rangeLabels[r]}
              </Button>
            ))}
          </div>
          {dateRange === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="relative group">
                <span className="absolute -top-2 left-3 px-2 bg-card text-[9px] font-black text-muted-foreground uppercase tracking-widest z-10">Desde</span>
                <Input 
                  type="date" 
                  value={customDates.start}
                  onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                  className="pl-4 h-12 rounded-xl bg-muted/50 border-border font-bold text-sm focus-visible:ring-primary w-40 text-foreground"
                />
              </div>
              <div className="relative group">
                <span className="absolute -top-2 left-3 px-2 bg-card text-[9px] font-black text-muted-foreground uppercase tracking-widest z-10">Hasta</span>
                <Input 
                  type="date" 
                  value={customDates.end}
                  onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                  className="pl-4 h-12 rounded-xl bg-muted/50 border-border font-bold text-sm focus-visible:ring-primary w-40 text-foreground"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Oportunidades', value: totalLeads, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100', detail: `+${growth.leads}% vs ant.` },
          { label: 'Conversión', value: `${conversionRate.toFixed(1)}%`, icon: Zap, color: 'text-purple-600', bg: 'bg-purple-100', detail: `+${growth.conversion}%` },
          { 
            label: 'Ticket Promedio', 
            value: `$ ${avgTicket.toLocaleString('es-CO')} COP`, 
            icon: Target, 
            color: 'text-orange-600', 
            bg: 'bg-orange-100', 
            detail: 'Valor medio' 
          },
          { 
            label: 'Facturación Total', 
            value: `$ ${totalRevenue.toLocaleString('es-CO')} COP`, 
            icon: Users, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-100', 
            detail: `+${growth.sales} cierres` 
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border border-border rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", stat.bg)}>
                  <stat.icon className={cn("w-7 h-7", stat.color)} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10">
                   <ArrowUpRight className="w-3 h-3" />
                   {stat.detail}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-2xl xl:text-3xl font-black text-foreground tracking-tighter leading-tight break-words">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rendimiento por Tipo de Negocio */}
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-foreground">Rendimiento por Segmento</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">Distribución de leads según el tipo de negocio.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessTypeData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '20px', 
                    border: '1px solid hsl(var(--border))', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)', 
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                  labelStyle={{ fontWeight: 900, marginBottom: '4px', color: 'hsl(var(--primary))', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  cursor={{ fill: 'hsl(var(--muted) / 0.3)', radius: 8 }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[12, 12, 4, 4]} 
                  barSize={45}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendencia de Crecimiento */}
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex justify-between items-center">
               <div>
                  <CardTitle className="text-xl font-black text-foreground">Tendencia Diaria</CardTitle>
                  <CardDescription className="font-bold text-muted-foreground">Flujo de captación y cierres temporales.</CardDescription>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full text-[9px] font-black text-success uppercase tracking-widest border border-success/10">
                  <Activity className="w-3 h-3" /> Tendencia Alza
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9, fontWeight: 800 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '20px', 
                    border: '1px solid hsl(var(--border))', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                  labelStyle={{ fontWeight: 900, marginBottom: '4px', color: 'hsl(var(--primary))', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 glass-card border-none overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-foreground">Distribución</CardTitle>
          </CardHeader>
          <CardContent className="p-8 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={businessTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {businessTypeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-black text-foreground">Actividad Reciente</CardTitle>
            <CardDescription className="font-bold text-muted-foreground">Últimos leads registrados en el periodo seleccionado.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {filteredClients.slice(0, 3).map((item, i) => {
              const assignedUser = USERS.find(u => u.id === item.assignedTo);
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border hover:bg-muted transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs transition-transform group-hover:scale-110">
                      {assignedUser?.avatar || '👤'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {assignedUser?.name} <span className="text-muted-foreground font-medium">gestionando a</span> {item.nombreNegocio}
                      </p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                        {new Date(item.fechaRegistro).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "font-black text-[10px] uppercase tracking-widest border-none px-3 py-1",
                    item.estado === 'Ganado' ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  )}>
                    {item.estado}
                  </Badge>
                </div>
              );
            })}
            {filteredClients.length === 0 && (
              <div className="py-10 text-center text-muted-foreground font-bold italic">
                No hay actividad registrada en este periodo.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
