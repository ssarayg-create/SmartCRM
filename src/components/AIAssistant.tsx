import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, User, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { getAssistantResponse } from '../services/geminiService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: '¡Hola! Soy tu Asistente SmartCRM. ¿En qué puedo ayudarte hoy con tu gestión comercial?' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAssistantResponse([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      toast.error('Error al obtener respuesta del asistente');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "¿Cómo añado un nuevo lead?",
    "¿Qué stages tiene el pipeline?",
    "¿Diferencia entre Combo Pro y Elite?",
    "¿Cómo contacto a soporte?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl border-primary/20 flex flex-col overflow-hidden backdrop-blur-xl bg-background/95">
              <CardHeader className="bg-primary p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-sm font-black uppercase tracking-widest">Asistente Smart</CardTitle>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-white/70 font-bold uppercase tracking-tight">En línea</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((m, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex items-start gap-2",
                          m.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1",
                          m.role === 'user' ? "bg-slate-200 dark:bg-slate-800" : "bg-primary/10"
                        )}>
                          {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                        </div>
                        <div className={cn(
                          "max-w-[80%] rounded-2xl p-3 text-sm font-medium",
                          m.role === 'user' 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-muted text-foreground rounded-tl-none border border-border/50"
                        )}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-2xl p-3 rounded-tl-none flex gap-1 items-center">
                          <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                          <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 bg-muted/30 border-t border-border">
                  {messages.length === 1 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1 mb-2">Preguntas frecuentes</p>
                      <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInput(q);
                              // Auto-submit could be nice but let user edit
                            }}
                            className="bg-background border border-border px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all text-left"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input 
                      placeholder="Escribe tu duda aquí..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="bg-background rounded-xl border-border/50 focus:ring-primary h-10 text-sm"
                    />
                    <Button 
                      type="submit" 
                      disabled={isLoading || !input.trim()}
                      className="rounded-xl h-10 w-10 p-0 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                  <p className="text-[9px] text-center text-muted-foreground mt-3 font-bold uppercase tracking-widest">
                    Asistente impulsado por IA • SmartCRM 2024
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300",
          isOpen 
            ? "bg-slate-200 dark:bg-slate-800 text-foreground" 
            : "bg-primary text-primary-foreground"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
