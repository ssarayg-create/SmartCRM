
import React, { useState, useEffect } from 'react';
import { Client, BusinessType, LeadStatus } from '../types';
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
import { Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (client: Partial<Client>) => void;
  initialData?: Client | null;
  businessTypes: string[];
}

export default function ClientForm({ open, onOpenChange, onSubmit, initialData, businessTypes }: ClientFormProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    nombreNegocio: '',
    tipoNegocio: businessTypes[0] as any || 'Restaurante',
    nombreContacto: '',
    telefono: '',
    email: '',
    ciudad: 'Bogotá',
    estado: 'Nuevo lead',
    proximoSeguimiento: new Date().toISOString().split('T')[0],
    necesidadDetectada: '',
    equipoOfrecido: '',
    presupuestoEstimado: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        proximoSeguimiento: new Date(initialData.proximoSeguimiento).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        nombreNegocio: '',
        tipoNegocio: businessTypes[0] as any || 'Restaurante',
        nombreContacto: '',
        telefono: '',
        email: '',
        ciudad: 'Bogotá',
        estado: 'Nuevo lead',
        proximoSeguimiento: new Date().toISOString().split('T')[0],
        necesidadDetectada: '',
        equipoOfrecido: '',
        presupuestoEstimado: 0
      });
    }
  }, [initialData, open, businessTypes]);

  const handleFormSubmit = () => {
    if (!formData.nombreNegocio?.trim() || !formData.telefono?.trim() || !formData.tipoNegocio) {
      toast.error('Completa todos los campos obligatorios', {
        icon: <AlertCircle className="w-5 h-5 text-danger" />,
        description: 'Negocio, Teléfono y Tipo de negocio son requeridos.'
      });
      return;
    }
    onSubmit(formData);
  };

  const recommendation = getRecommendation(formData.tipoNegocio as any);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-card">
        <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <DialogTitle className="text-2xl font-black tracking-tight relative z-10">
            {initialData ? 'Editar Negocio' : 'Nuevo Negocio POS'}
          </DialogTitle>
          <p className="text-slate-400 text-sm mt-1 font-medium relative z-10">Completa la información para gestionar la oportunidad comercial.</p>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombreNegocio" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                Nombre del Negocio <span className="text-danger">*</span>
              </Label>
              <Input 
                id="nombreNegocio" 
                value={formData.nombreNegocio} 
                onChange={(e) => setFormData({...formData, nombreNegocio: e.target.value})}
                className="rounded-2xl bg-muted border-border h-12 focus-visible:ring-primary font-bold text-foreground"
                placeholder="Ej: Restaurante El Sabor"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                Tipo de Negocio <span className="text-danger">*</span>
              </Label>
              <Select 
                value={formData.tipoNegocio} 
                onValueChange={(v) => setFormData({...formData, tipoNegocio: v as any})}
              >
                <SelectTrigger className="rounded-2xl bg-muted border-border h-12 font-bold text-foreground">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border shadow-xl bg-card text-foreground">
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombreContacto" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre del Contacto</Label>
              <Input 
                id="nombreContacto" 
                value={formData.nombreContacto} 
                onChange={(e) => setFormData({...formData, nombreContacto: e.target.value})}
                className="rounded-2xl bg-muted border-border h-12 focus-visible:ring-primary font-bold text-foreground"
                placeholder="Nombre de la persona"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                Teléfono <span className="text-danger">*</span>
              </Label>
              <Input 
                id="telefono" 
                value={formData.telefono} 
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="rounded-2xl bg-muted border-border h-12 focus-visible:ring-primary font-bold text-foreground"
                placeholder="Ej: 300 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="rounded-2xl bg-muted border-border h-12 focus-visible:ring-primary font-bold text-foreground"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudad" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Ciudad</Label>
              <Input 
                id="ciudad" 
                value={formData.ciudad} 
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                className="rounded-2xl bg-muted border-border h-12 focus-visible:ring-primary font-bold text-foreground"
                placeholder="Ej: Bogotá"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Estado Comercial</Label>
              <Select 
                value={formData.estado} 
                onValueChange={(v) => setFormData({...formData, estado: v as LeadStatus})}
              >
                <SelectTrigger className="rounded-2xl bg-muted border-border h-12 font-bold text-foreground">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border shadow-xl bg-card text-foreground">
                  <SelectItem value="Nuevo lead">Nuevo lead</SelectItem>
                  <SelectItem value="Contacto inicial">Contacto inicial</SelectItem>
                  <SelectItem value="Demo del sistema POS">Demo del sistema POS</SelectItem>
                  <SelectItem value="Envío de propuesta">Envío de propuesta</SelectItem>
                  <SelectItem value="Negociación">Negociación</SelectItem>
                  <SelectItem value="Venta cerrada">Venta cerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proximoSeguimiento" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Próximo Seguimiento</Label>
              <Input 
                id="proximoSeguimiento" 
                type="date"
                value={formData.proximoSeguimiento} 
                onChange={(e) => setFormData({...formData, proximoSeguimiento: e.target.value})}
                className="rounded-2xl bg-muted border-border h-12 focus-visible:ring-primary font-bold text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipoOfrecido" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Equipo Ofrecido</Label>
              <Input 
                id="equipoOfrecido" 
                value={formData.equipoOfrecido} 
                onChange={(e) => setFormData({...formData, equipoOfrecido: e.target.value})}
                className="rounded-2xl bg-muted border-border h-12 focus-visible:ring-primary font-bold text-foreground"
                placeholder="Ej: Combo POS Básico"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presupuestoEstimado" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Presupuesto Estimado (COP)</Label>
              <Input 
                id="presupuestoEstimado" 
                type="number"
                value={formData.presupuestoEstimado} 
                onChange={(e) => setFormData({...formData, presupuestoEstimado: Number(e.target.value)})}
                className="rounded-2xl bg-muted border-border h-12 focus-visible:ring-primary font-bold text-foreground"
                placeholder="Ej: 1500000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="necesidadDetectada" className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Necesidad Detectada</Label>
            <textarea 
              id="necesidadDetectada"
              value={formData.necesidadDetectada}
              onChange={(e) => setFormData({...formData, necesidadDetectada: e.target.value})}
              className="w-full min-h-[80px] rounded-2xl bg-muted border border-border p-4 focus:ring-2 focus:ring-primary focus:outline-none font-medium text-sm transition-all text-foreground"
              placeholder="Ej: Control de ventas, facturación, inventario..."
            />
          </div>

          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-black text-primary uppercase tracking-widest">Sugerencia Comercial IA</span>
            </div>
            <p className="text-sm text-foreground font-bold leading-relaxed">
              Recomendamos: <span className="text-primary">{recommendation.recomendar}</span>
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-[10px] font-black bg-card px-3 py-1 rounded-full border border-border text-primary shadow-sm">
                {recommendation.plan}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">
                {recommendation.equipos}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-muted/50 border-t border-border flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl px-6 font-bold text-muted-foreground hover:bg-muted">
            Cancelar
          </Button>
          <Button onClick={handleFormSubmit} className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-6 h-auto shadow-xl shadow-primary/20 font-black transition-all hover:scale-[1.02] active:scale-[0.98]">
            {initialData ? 'Guardar Cambios' : 'Crear Negocio'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
