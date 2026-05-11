
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Client, LeadStatus } from '../types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { getRecommendation } from '../lib/crm-logic';
import { Sparkles, AlertCircle, MapPin, Building2, User, Phone, Mail, DollarSign, Package, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const clientSchema = z.object({
  nombreNegocio: z.string().min(3, "El nombre del negocio debe tener al menos 3 caracteres"),
  tipoNegocio: z.string().min(1, "Seleccione un tipo de negocio"),
  nombreContacto: z.string().min(3, "El nombre del contacto debe tener al menos 3 caracteres"),
  telefono: z.string().min(7, "Ingrese un teléfono válido").max(15, "El teléfono es demasiado largo"),
  email: z.string().email("Ingrese un correo válido").optional().or(z.literal('')),
  pais: z.string().min(1, "Seleccione un país"),
  ciudad: z.string().min(1, "Seleccione una ciudad"),
  estado: z.string().min(1, "Seleccione un estado comercial"),
  temperatura: z.string().min(1, "Seleccione una temperatura"),
  proximoSeguimiento: z.string().min(1, "Seleccione una fecha de seguimiento"),
  necesidadDetectada: z.string().min(1, "La necesidad es requerida para generar propuestas"),
  equipoOfrecido: z.string().optional(),
  presupuestoEstimado: z.number().min(0, "El presupuesto no puede ser negativo"),
  comentarios: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (client: Partial<Client>) => void;
  initialData?: Client | null;
  businessTypes: string[];
}

const COUNTRIES = [
  { name: "Colombia", code: "CO", emoji: "🇨🇴" },
  { name: "México", code: "MX", emoji: "🇲🇽" },
  { name: "Ecuador", code: "EC", emoji: "🇪🇨" },
  { name: "Panamá", code: "PA", emoji: "🇵🇦" },
  { name: "Costa Rica", code: "CR", emoji: "🇨🇷" },
  { name: "Guatemala", code: "GT", emoji: "🇬🇹" },
  { name: "El Salvador", code: "SV", emoji: "🇸🇻" }
];

const LATAM_CITIES = [
  "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira", "Santa Marta",
  "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Querétaro",
  "Buenos Aires", "Córdoba", "Rosario", "Mendoza",
  "Santiago", "Valparaíso", "Concepción",
  "Lima", "Arequipa", "Trujillo",
  "Quito", "Guayaquil", "Cuenca",
  "San José", "Panamá", "Guatemala", "San Salvador"
];

export default function ClientForm({ open, onOpenChange, onSubmit, initialData, businessTypes }: ClientFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nombreNegocio: '',
      tipoNegocio: 'Restaurante',
      nombreContacto: '',
      telefono: '',
      email: '',
      pais: 'Colombia',
      ciudad: 'Bogotá',
      estado: 'Nuevos prospectos',
      temperatura: 'Tibio',
      proximoSeguimiento: new Date().toISOString().split('T')[0],
      necesidadDetectada: '',
      equipoOfrecido: '',
      presupuestoEstimado: 0,
    }
  });

  const [citySearch, setCitySearch] = useState('');
  const filteredCities = LATAM_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        pais: (initialData as any).pais || 'Colombia',
        proximoSeguimiento: initialData.proximoSeguimiento ? new Date(initialData.proximoSeguimiento).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        email: initialData.email || '',
        necesidadDetectada: initialData.necesidadDetectada || '',
        equipoOfrecido: initialData.equipoOfrecido || '',
        presupuestoEstimado: initialData.presupuestoEstimado || 0,
      });
    } else {
      reset({
        nombreNegocio: '',
        tipoNegocio: businessTypes[0] || 'Restaurante',
        nombreContacto: '',
        telefono: '',
        email: '',
        pais: 'Colombia',
        ciudad: 'Bogotá',
        estado: 'Nuevos prospectos',
        temperatura: 'Tibio',
        proximoSeguimiento: new Date().toISOString().split('T')[0],
        necesidadDetectada: '',
        equipoOfrecido: '',
        presupuestoEstimado: 0,
      });
    }
  }, [initialData, open, businessTypes, reset]);

  const onFormSubmit = (data: ClientFormValues) => {
    onSubmit(data as Partial<Client>);
  };

  const tipoNegocio = watch('tipoNegocio');
  const recommendation = getRecommendation(tipoNegocio as any);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] border border-border shadow-2xl p-0 overflow-hidden bg-card transition-all duration-300">
        <div className="bg-slate-950 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -mr-40 -mt-40 blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full -ml-20 -mb-20 blur-[60px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-3xl font-black tracking-tight">
                {initialData ? 'Editar Negocio' : 'Nuevo Negocio POS'}
              </DialogTitle>
            </div>
            <p className="text-slate-400 text-sm font-medium">Software CRM especializado para sistemas de punto de venta.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="bg-card">
          <div className="p-10 space-y-8 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 transition-colors">
            {/* Sección: Información del Negocio */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-2 h-6 bg-primary rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground/80">Información del Negocio</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    Nombre del Negocio <span className="text-danger">*</span>
                  </Label>
                  <Input 
                    {...register('nombreNegocio')}
                    className={`rounded-2xl bg-muted/50 border-border h-12 focus-visible:ring-primary font-bold text-foreground transition-all focus:bg-background ${errors.nombreNegocio ? 'border-danger ring-danger/20' : ''}`}
                    placeholder="Ej: Restaurante El Sabor"
                  />
                  {errors.nombreNegocio && <p className="text-[10px] font-bold text-danger mt-1 ml-2">{errors.nombreNegocio.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-primary" />
                    Tipo de Negocio <span className="text-danger">*</span>
                  </Label>
                  <Select 
                    value={watch('tipoNegocio')} 
                    onValueChange={(v) => setValue('tipoNegocio', v)}
                  >
                    <SelectTrigger className="rounded-2xl bg-muted/50 border-border h-12 font-bold text-foreground transition-all focus:bg-background">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border shadow-xl bg-card text-foreground">
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type} className="font-bold">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary" />
                    Nombre del Contacto <span className="text-danger">*</span>
                  </Label>
                  <Input 
                    {...register('nombreContacto')}
                    className={`rounded-2xl bg-muted/50 border-border h-12 focus-visible:ring-primary font-bold text-foreground transition-all focus:bg-background ${errors.nombreContacto ? 'border-danger ring-danger/20' : ''}`}
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.nombreContacto && <p className="text-[10px] font-bold text-danger mt-1 ml-2">{errors.nombreContacto.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    Teléfono <span className="text-danger">*</span>
                  </Label>
                  <Input 
                    {...register('telefono')}
                    className={`rounded-2xl bg-muted/50 border-border h-12 focus-visible:ring-primary font-bold text-foreground transition-all focus:bg-background ${errors.telefono ? 'border-danger ring-danger/20' : ''}`}
                    placeholder="Ej: 300 123 4567"
                  />
                  {errors.telefono && <p className="text-[10px] font-bold text-danger mt-1 ml-2">{errors.telefono.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    Email
                  </Label>
                  <Input 
                    {...register('email')}
                    className={`rounded-2xl bg-muted/50 border-border h-12 focus-visible:ring-primary font-bold text-foreground transition-all focus:bg-background ${errors.email ? 'border-danger ring-danger/20' : ''}`}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && <p className="text-[10px] font-bold text-danger mt-1 ml-2">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    País <span className="text-danger">*</span>
                  </Label>
                  <Select 
                    value={watch('pais')} 
                    onValueChange={(v) => setValue('pais', v)}
                  >
                    <SelectTrigger className="rounded-2xl bg-muted/50 border-border h-12 font-bold text-foreground transition-all focus:bg-background">
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border shadow-xl bg-card text-foreground">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.name} className="font-bold">
                          {country.emoji} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    Ciudad <span className="text-danger">*</span>
                  </Label>
                  <Select 
                    value={watch('ciudad')} 
                    onValueChange={(v) => setValue('ciudad', v)}
                  >
                    <SelectTrigger className="rounded-2xl bg-muted/50 border-border h-12 font-bold text-foreground transition-all focus:bg-background">
                      <SelectValue placeholder="Seleccionar ciudad" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border shadow-xl bg-card text-foreground max-h-[200px]">
                      <div className="p-2 sticky top-0 bg-card z-10">
                        <Input 
                          placeholder="Buscar ciudad..." 
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="h-8 text-xs rounded-lg bg-muted border-border"
                        />
                      </div>
                      {filteredCities.map((city) => (
                        <SelectItem key={city} value={city} className="font-bold">{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sección: Oportunidad Comercial */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-2 h-6 bg-blue-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground/80">Oportunidad Comercial</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1">Estado Comercial</Label>
                  <Select 
                    value={watch('estado')} 
                    onValueChange={(v) => setValue('estado', v)}
                  >
                    <SelectTrigger className="rounded-2xl bg-muted/50 border-border h-12 font-bold text-foreground transition-all focus:bg-background">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border shadow-xl bg-card text-foreground">
                      <SelectItem value="Nuevos prospectos" className="font-bold">Nuevos prospectos</SelectItem>
                      <SelectItem value="Contacto inicial" className="font-bold">Contacto inicial</SelectItem>
                      <SelectItem value="Presentación" className="font-bold">Presentación</SelectItem>
                      <SelectItem value="Negociación" className="font-bold">Negociación</SelectItem>
                      <SelectItem value="Propuesta enviada" className="font-bold">Propuesta enviada</SelectItem>
                      <SelectItem value="Ganado" className="font-bold text-primary">Ganado</SelectItem>
                      <SelectItem value="Perdido" className="font-bold text-danger">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1">Temperatura</Label>
                  <Select 
                    value={watch('temperatura')} 
                    onValueChange={(v) => setValue('temperatura', v)}
                  >
                    <SelectTrigger className="rounded-2xl bg-muted/50 border-border h-12 font-bold text-foreground transition-all focus:bg-background">
                      <SelectValue placeholder="Seleccionar temperatura" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border shadow-xl bg-card text-foreground">
                      <SelectItem value="Frío" className="font-bold">❄️ Frío</SelectItem>
                      <SelectItem value="Tibio" className="font-bold text-orange-500">🔥 Tibio</SelectItem>
                      <SelectItem value="Caliente" className="font-bold text-danger">🌋 Caliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1">Próximo Seguimiento</Label>
                  <Input 
                    type="date"
                    {...register('proximoSeguimiento')}
                    className="rounded-2xl bg-muted/50 border-border h-12 focus-visible:ring-primary font-bold text-foreground transition-all focus:bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-primary" />
                    Presupuesto Estimado (COP)
                  </Label>
                  <Input 
                    type="number"
                    {...register('presupuestoEstimado', { valueAsNumber: true })}
                    className="rounded-2xl bg-muted/50 border-border h-12 focus-visible:ring-primary font-bold text-foreground transition-all focus:bg-background"
                    placeholder="Ej: 1500000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  Necesidad Detectada <span className="text-danger">*</span>
                </Label>
                <textarea 
                  {...register('necesidadDetectada')}
                  className={`w-full min-h-[100px] rounded-2xl bg-muted/50 border border-border p-4 focus:ring-2 focus:ring-primary focus:outline-none font-medium text-sm transition-all text-foreground focus:bg-background ${errors.necesidadDetectada ? 'border-danger ring-danger/20' : ''}`}
                  placeholder="Ej: El cliente requiere control de inventarios y facturación electrónica para 2 cajas..."
                />
                {errors.necesidadDetectada && <p className="text-[10px] font-bold text-danger mt-1 ml-2">{errors.necesidadDetectada.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  Comentarios Adicionales
                </Label>
                <textarea 
                  {...register('comentarios')}
                  className="w-full min-h-[80px] rounded-2xl bg-muted/50 border border-border p-4 focus:ring-2 focus:ring-primary focus:outline-none font-medium text-sm transition-all text-foreground focus:bg-background"
                  placeholder="Información adicional relevante..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-primary" />
                  Equipo Sugerido
                </Label>
                <Input 
                  {...register('equipoOfrecido')}
                  className="rounded-2xl bg-muted/50 border-border h-12 focus-visible:ring-primary font-bold text-foreground transition-all focus:bg-background"
                  placeholder="Ej: Pack POS Premium"
                />
              </div>
            </div>

            {/* Sugerencia IA */}
            {!initialData && (
              <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 relative overflow-hidden group hover:bg-primary/10 transition-colors">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-125" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Asistente Comercial IA</span>
                </div>
                <div className="space-y-3 relative z-10">
                  <p className="text-base text-foreground font-black leading-tight">
                    Estrategia recomendada: <span className="text-primary">{recommendation.recomendar}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-black bg-white dark:bg-slate-900 px-4 py-1.5 rounded-full border border-primary/20 text-primary shadow-sm uppercase tracking-wider">
                      {recommendation.plan}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-4 py-1.5 rounded-full border border-border uppercase tracking-wider">
                      {recommendation.equipos}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-10 bg-muted/30 border-t border-border flex justify-end items-center gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="rounded-2xl px-8 font-black text-muted-foreground hover:bg-muted/80 h-14"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 h-14 shadow-2xl shadow-primary/30 font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {initialData ? 'Guardar Cambios' : 'Crear Negocio POS'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
