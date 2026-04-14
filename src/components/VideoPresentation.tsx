import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, X, Zap, LayoutDashboard, Users, Kanban, MessageSquare, Bell, MousePointer2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Scene {
  id: number;
  duration: number;
  title: string;
  subtitle: string;
  overlayText: string;
  component: React.ReactNode;
}

export default function VideoPresentation({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);

  const scenes: Scene[] = [
    {
      id: 0,
      duration: 5,
      title: "HOOK",
      subtitle: "Impacto Inicial",
      overlayText: "Así creamos un CRM con inteligencia artificial en minutos",
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-32 h-32 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/40"
          >
            <Zap className="w-16 h-16 text-white" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white max-w-3xl leading-none"
          >
            SMART<span className="text-primary">CRM</span> <br />
            <span className="text-3xl md:text-5xl opacity-80">POWERED BY AI</span>
          </motion.h2>
        </div>
      )
    },
    {
      id: 1,
      duration: 15,
      title: "PASO 1",
      subtitle: "Registro",
      overlayText: "Iniciamos sesión con nuestra cuenta para acceder a la plataforma",
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl">
            <div className="space-y-6">
              <div className="h-4 w-1/3 bg-white/20 rounded-full" />
              <div className="space-y-3">
                <div className="h-12 w-full bg-white/5 rounded-2xl border border-white/10" />
                <div className="h-12 w-full bg-white/5 rounded-2xl border border-white/10" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-12 w-full bg-primary rounded-2xl flex items-center justify-center font-black text-white"
              >
                Sign in with Google
              </motion.div>
            </div>
          </div>
          <motion.div 
            initial={{ x: 100, y: 100 }}
            animate={{ x: 20, y: -20 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="text-primary"
          >
            <MousePointer2 className="w-12 h-12 fill-current" />
          </motion.div>
        </div>
      )
    },
    {
      id: 2,
      duration: 15,
      title: "PASO 2",
      subtitle: "Crear Proyecto",
      overlayText: "Seleccionamos crear un nuevo proyecto CRM",
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-12">
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            {[1, 2, 3, 4].map(i => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className={`aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 ${i === 1 ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'}`}
              >
                {i === 1 ? (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-black text-white text-sm">NUEVO CRM</span>
                  </>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/5" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      duration: 25,
      title: "PASO 3",
      subtitle: "Generación con IA",
      overlayText: "Usamos prompts inteligentes para definir la estructura",
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8 w-full max-w-3xl">
          <div className="w-full p-8 bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="font-mono text-primary/80 text-lg">
              <motion.p
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="whitespace-nowrap overflow-hidden border-r-2 border-primary"
              >
                {">"} Crear un sistema CRM para gestión de clientes...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.5 }}
                className="mt-4 text-white/60 text-sm"
              >
                [IA] Generando módulos de ventas... <br />
                [IA] Configurando base de datos... <br />
                [IA] Diseñando interfaz moderna...
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 6, duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary/5 flex items-center justify-center"
            >
              <Sparkles className="w-24 h-24 text-primary opacity-20" />
            </motion.div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      duration: 25,
      title: "PASO 4",
      subtitle: "Personalización",
      overlayText: "Ajustamos módulos: clientes, ventas, inventario y reportes",
      component: (
        <div className="flex items-center justify-center h-full w-full max-w-5xl gap-8">
          <div className="w-64 h-96 bg-white/5 rounded-[2.5rem] border border-white/10 p-6 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div 
                key={i}
                animate={{ x: [0, 10, 0] }}
                transition={{ delay: i * 0.5, duration: 2, repeat: Infinity }}
                className="h-10 w-full bg-white/5 rounded-xl border border-white/5" 
              />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6">
            {[LayoutDashboard, Users, Kanban, MessageSquare].map((Icon, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3 }}
                className="aspect-square bg-white/5 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center gap-4"
              >
                <Icon className="w-12 h-12 text-primary" />
                <div className="h-2 w-20 bg-white/10 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 5,
      duration: 25,
      title: "RESULTADO",
      subtitle: "CRM Listo",
      overlayText: "CRM funcional y listo para usar en tu negocio",
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 text-success" />
          </motion.div>
          <h2 className="text-6xl font-black text-white tracking-tighter">¡SISTEMA LISTO!</h2>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-primary rounded-2xl font-black text-white shadow-xl shadow-primary/20">DASHBOARD</div>
            <div className="px-6 py-3 bg-white/10 rounded-2xl font-black text-white border border-white/10">VENTAS</div>
            <div className="px-6 py-3 bg-white/10 rounded-2xl font-black text-white border border-white/10">EQUIPO</div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      duration: 10,
      title: "CIERRE",
      subtitle: "Final",
      overlayText: "Creamos un CRM funcional usando inteligencia artificial",
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tighter">EMPIEZA HOY</h2>
            <p className="text-xl text-white/60 font-bold">Tu negocio, potenciado por IA</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Smart<span className="text-primary">CRM</span></h1>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const currentSceneDuration = scenes[currentScene].duration;
          const increment = 100 / (currentSceneDuration * 10); // 100ms interval
          
          if (prev >= 100) {
            if (currentScene < scenes.length - 1) {
              setCurrentScene(s => s + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + increment;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentScene]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentScene(0);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-50 bg-gradient-to-b from-slate-950 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase">Video Tutorial</h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">SmartCRM AI Edition</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full bg-white/5 hover:bg-white/10 text-white"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Stage */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#020617]">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/20 blur-[120px] rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex items-center justify-center p-12"
          >
            {scenes[currentScene].component}
          </motion.div>
        </AnimatePresence>

        {/* Overlay Text */}
        <div className="absolute bottom-32 inset-x-0 flex justify-center px-12 pointer-events-none">
          <motion.div
            key={currentScene + "_text"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-3xl max-w-2xl text-center"
          >
            <p className="text-xl md:text-2xl font-black text-white leading-tight">
              {scenes[currentScene].overlayText}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 bg-slate-900/50 backdrop-blur-2xl border-t border-white/5 z-50">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Progress Bar */}
          <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 flex w-full">
              {scenes.map((scene, idx) => (
                <div 
                  key={idx} 
                  className="h-full border-r border-slate-950/50" 
                  style={{ width: `${(scene.duration / 120) * 100}%` }}
                >
                  <div 
                    className={`h-full transition-all duration-100 ${idx < currentScene ? 'bg-primary' : idx === currentScene ? 'bg-primary/40' : 'bg-transparent'}`}
                    style={idx === currentScene ? { width: `${progress}%`, backgroundColor: 'rgb(59 130 246)' } : {}}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                onClick={handleTogglePlay}
                className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleReset}
                className="w-12 h-12 rounded-full text-white/60 hover:text-white hover:bg-white/5"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
              <div className="space-y-1">
                <p className="text-xs font-black text-primary uppercase tracking-widest">Escena {currentScene + 1}</p>
                <p className="text-lg font-black text-white tracking-tight">{scenes[currentScene].title}: {scenes[currentScene].subtitle}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-black text-white/80 uppercase tracking-widest">Modo Presentación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
