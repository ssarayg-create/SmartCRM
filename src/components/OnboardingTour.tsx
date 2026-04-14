import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, LayoutDashboard, Users, Kanban, MessageSquare, Bell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  tab: string;
}

const STEPS: Step[] = [
  {
    title: "Bienvenido al Dashboard",
    description: "Aquí tendrás un resumen visual de tu rendimiento, ventas cerradas y probabilidad de éxito de tus leads.",
    icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
    tab: "dashboard"
  },
  {
    title: "Gestión de Clientes",
    description: "En esta sección puedes ver tu lista completa de leads, agregar nuevos y filtrar por vendedor o estado.",
    icon: <Users className="w-8 h-8 text-secondary" />,
    tab: "leads"
  },
  {
    title: "Pipeline Visual",
    description: "Arrastra y suelta tus leads entre diferentes etapas para gestionar el embudo de ventas de forma ágil.",
    icon: <Kanban className="w-8 h-8 text-warning" />,
    tab: "pipeline"
  },
  {
    title: "Chat Interno",
    description: "Coordina con tu equipo de ventas sin salir de la plataforma. Comunicación fluida para mejores cierres.",
    icon: <MessageSquare className="w-8 h-8 text-success" />,
    tab: "chat"
  },
  {
    title: "Notificaciones",
    description: "Recibe alertas sobre nuevos leads, cambios de estado y recordatorios importantes de seguimiento.",
    icon: <Bell className="w-8 h-8 text-danger" />,
    tab: "notifications"
  }
];

interface OnboardingTourProps {
  onComplete: () => void;
  onTabChange: (tab: string) => void;
}

export default function OnboardingTour({ onComplete, onTabChange }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    onTabChange(STEPS[currentStep].tab);
  }, [currentStep, onTabChange]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="max-w-md w-full"
        >
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
            <CardContent className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                  {step.icon}
                </div>
                <button 
                  onClick={onComplete}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black text-primary uppercase tracking-widest">
                    Paso {currentStep + 1} de {STEPS.length}
                  </span>
                  <div className="flex gap-1">
                    {STEPS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-4 bg-primary' : 'bg-muted'}`} 
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-foreground tracking-tight leading-none">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                {currentStep > 0 && (
                  <Button 
                    variant="outline"
                    onClick={handlePrev}
                    className="h-14 px-6 rounded-2xl border-border font-black text-foreground hover:bg-muted"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Atrás
                  </Button>
                )}
                <Button 
                  onClick={handleNext}
                  className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 group"
                >
                  <span>{currentStep === STEPS.length - 1 ? '¡Empezar ahora!' : 'Siguiente'}</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      {/* Overlay instructions */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white pointer-events-none">
        <Zap className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-xs font-black uppercase tracking-widest">Guía Rápida de SmartCRM</span>
      </div>
    </div>
  );
}
