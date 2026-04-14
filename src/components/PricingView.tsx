import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Star, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PLANS } from '../constants';
import { PlanType } from '../types';
import { toast } from 'sonner';
import { Phone } from 'lucide-react';

interface PricingViewProps {
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
}

export default function PricingView({ currentPlan, onUpgrade }: PricingViewProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-5xl font-black tracking-tighter text-foreground">Planes que <span className="text-primary">escalan</span> con tu éxito</h2>
        <p className="text-xl text-muted-foreground font-semibold leading-relaxed">
          Elige el plan perfecto para tu equipo comercial. Sin contratos ocultos, cancela cuando quieras.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, i) => {
          const isPremium = plan.name === 'Premium';
          const isPro = plan.name === 'Profesional';
          const isCurrent = currentPlan === plan.name;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {isPremium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                    Más Popular
                  </Badge>
                </div>
              )}

              <Card className={cn(
                "h-full border-none rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02]",
                isPremium ? "shadow-[0_40px_80px_-16px_rgba(37,99,235,0.15)] ring-2 ring-primary" : "shadow-[0_20px_40px_-8px_rgba(0,0,0,0.05)]",
                isCurrent && "ring-2 ring-success"
              )}>
                <CardHeader className={cn(
                  "p-10 pb-6",
                  isPremium ? "bg-primary/5" : isPro ? "bg-secondary/5" : "bg-muted"
                )}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isPremium ? "bg-primary text-white" : isPro ? "bg-secondary text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {isPremium ? <Star className="w-5 h-5" /> : isPro ? <Zap className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    </div>
                    <CardTitle className="text-2xl font-black text-foreground tracking-tight">{plan.name}</CardTitle>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-foreground">${plan.priceUSD}</span>
                      <span className="text-muted-foreground font-bold">USD / mes</span>
                    </div>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">
                      ${plan.priceCOP.toLocaleString()} COP
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-10 space-y-6">
                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          isPremium ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-10 pt-0">
                  <Button 
                    onClick={() => !isCurrent && onUpgrade(plan.name)}
                    disabled={isCurrent}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black text-lg transition-all group",
                      isCurrent 
                        ? "bg-success/10 text-success border-2 border-success/20 cursor-default" 
                        : isPremium 
                          ? "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20" 
                          : "bg-primary hover:bg-primary/90 text-white"
                    )}
                  >
                    <span>{isCurrent ? 'Plan Actual' : plan.buttonText}</span>
                    {!isCurrent && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full -ml-48 -mb-48 blur-[100px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl font-black tracking-tighter">¿Necesitas una solución <span className="text-primary">Enterprise</span>?</h3>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Para equipos de más de 100 personas, ofrecemos despliegues personalizados, integraciones API ilimitadas y soporte 24/7 dedicado.
            </p>
            <Button 
              onClick={() => toast.info("Contactar a Ventas", {
                description: "Llámanos o escríbenos al +57 300 123 4567 para una solución personalizada.",
                icon: <Phone className="w-5 h-5 text-primary" />
              })}
              className="h-14 px-10 rounded-2xl bg-white text-slate-950 font-black text-lg hover:bg-slate-100 transition-all"
            >
              Hablar con Ventas
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'SLA Garantizado', value: '99.9%' },
              { label: 'Soporte', value: '24/7' },
              { label: 'Seguridad', value: 'SOC2' },
              { label: 'Uptime', value: 'Global' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className="text-2xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
