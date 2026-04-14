import React, { useState } from 'react';
import { Send, User, Clock, CheckCheck, Paperclip, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Client, Message } from '../types';

interface ChatViewProps {
  client: Client;
  onSendMessage: (clientId: string, text: string) => void;
}

export default function ChatView({ client, onSendMessage }: ChatViewProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(client.id, text);
      setText('');
    }
  };

  return (
    <Card className="h-[600px] flex flex-col border-none rounded-[2.5rem] overflow-hidden glass-card">
      <CardHeader className="p-8 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary">
              {client.nombreNegocio.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-xl font-black text-foreground tracking-tight">{client.nombreNegocio}</CardTitle>
              <CardDescription className="font-bold text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Chat con {client.nombreContacto}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <ScrollArea className="h-full p-8">
          <div className="space-y-6">
            {client.messages.length > 0 ? (
              client.messages.map((msg, i) => {
                const isMe = msg.senderId === 'u1';
                return (
                  <div key={msg.id} className={cn(
                    "flex flex-col max-w-[80%]",
                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-[1.5rem] text-sm font-bold leading-relaxed shadow-sm",
                      isMe ? "bg-primary text-white rounded-tr-none" : "bg-card text-foreground border border-border rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-2 px-1">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
                <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
                  <User className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm font-black uppercase tracking-widest">No hay mensajes aún</p>
                <p className="text-xs font-bold mt-1">Inicia la conversación con este cliente.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <div className="p-8 bg-muted/50 border-t border-border">
        <div className="relative">
          <Input 
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="h-14 pl-6 pr-16 rounded-2xl bg-card border-border shadow-sm focus:ring-primary font-bold text-foreground"
          />
          <Button 
            onClick={handleSend}
            className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
