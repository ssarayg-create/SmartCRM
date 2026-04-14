import React, { useState } from 'react';
import { Send, Search, User, Users, Info, MoreVertical, Phone, Video, Paperclip, Smile, CheckCheck, MessageSquare, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { InternalChat, User as UserType, Message } from '../types';
import { USERS, INTERNAL_CHATS } from '../constants';

interface InternalChatViewProps {
  currentUser: UserType;
  initialChats: InternalChat[];
  onUpdateChats?: (chats: InternalChat[]) => void;
}

export default function InternalChatView({ currentUser, initialChats, onUpdateChats }: InternalChatViewProps) {
  const [chats, setChats] = useState<InternalChat[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState<string>(initialChats[0]?.id || '');
  const [messageText, setMessageText] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showList, setShowList] = useState(true);

  const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    if (window.innerWidth < 1024) {
      setShowList(false);
    }
  };

  if (!selectedChat && chats.length === 0) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center animate-in fade-in duration-700">
        <Card className="p-12 text-center glass-card border-none rounded-[2.5rem] shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">Sin chats internos</h3>
          <p className="text-muted-foreground font-bold mt-2">No tienes conversaciones activas con el equipo por ahora.</p>
        </Card>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      text: messageText,
      timestamp: new Date().toISOString()
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageText,
          lastMessageTime: 'Ahora'
        };
      }
      return chat;
    });

    setChats(updatedChats);
    onUpdateChats?.(updatedChats);
    setMessageText('');
  };

  const getParticipantInfo = (userId: string) => {
    return USERS.find(u => u.id === userId);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-0 lg:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
      {/* Sidebar de Chats */}
      <Card className={cn(
        "w-full lg:w-96 flex flex-col border-none rounded-none lg:rounded-[2.5rem] overflow-hidden glass-card shadow-xl transition-all duration-300 z-20",
        !showList && "hidden lg:flex"
      )}>
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground tracking-tight">Chats</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground">
                <Users className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar o empezar un nuevo chat" 
              className="pl-12 h-12 rounded-2xl bg-muted border-none text-sm font-medium text-foreground focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 bg-card">
          <div className="divide-y divide-border/50">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={cn(
                  "w-full p-4 flex items-center gap-4 transition-all duration-200 hover:bg-muted/50 relative",
                  selectedChatId === chat.id && "bg-muted"
                )}
              >
                {selectedChatId === chat.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary shadow-sm shrink-0 overflow-hidden">
                  {chat.avatar}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-black text-foreground truncate">
                      {chat.name}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate font-medium text-muted-foreground">
                      {chat.lastMessage}
                    </p>
                    {chat.id === 'ic1' && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-[10px] font-black">2</Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Área de Chat */}
      <Card className={cn(
        "flex-1 flex flex-col border-none rounded-none lg:rounded-[2.5rem] overflow-hidden glass-card shadow-xl relative z-10",
        showList && "hidden lg:flex"
      )}>
        {/* Header del Chat */}
        <div className="p-4 sm:p-5 border-b border-border bg-card flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-xl text-muted-foreground"
              onClick={() => setShowList(true)}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary shadow-sm">
              {selectedChat.avatar}
            </div>
            <div className="cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
              <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight truncate max-w-[150px] sm:max-w-none">{selectedChat.name}</h3>
              <p className="text-[10px] font-bold text-success uppercase tracking-widest">En línea</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mensajes con fondo tipo WhatsApp */}
        <div className="flex-1 flex overflow-hidden relative bg-[#e5ddd5] dark:bg-[#0b141a] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            <ScrollArea className="flex-1 p-4 sm:p-8">
              <div className="space-y-4">
                {selectedChat.messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUser.id;
                  
                  return (
                    <div key={msg.id} className={cn(
                      "flex w-full mb-2",
                      isMe ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl shadow-sm relative",
                        isMe 
                          ? "bg-primary text-white rounded-tr-none" 
                          : "bg-card text-foreground rounded-tl-none border border-border/50"
                      )}>
                        {!isMe && selectedChat.type === 'group' && (
                          <p className="text-[10px] font-black text-primary mb-1 uppercase tracking-widest">
                            {getParticipantInfo(msg.senderId)?.name}
                          </p>
                        )}
                        <p className="text-sm font-medium leading-relaxed">
                          {msg.text}
                        </p>
                        <div className={cn(
                          "flex items-center justify-end gap-1 mt-1",
                          isMe ? "text-white/70" : "text-muted-foreground"
                        )}>
                          <span className="text-[9px] font-bold">
                            {msg.timestamp.includes('T') ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : msg.timestamp}
                          </span>
                          {isMe && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Input de Mensaje tipo WhatsApp */}
            <div className="p-4 bg-card border-t border-border flex items-center gap-3">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                  <Smile className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                  <Paperclip className="w-6 h-6" />
                </Button>
              </div>
              <div className="flex-1 relative">
                <Input 
                  placeholder="Escribe un mensaje..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="h-12 px-6 rounded-2xl bg-muted border-none shadow-none focus-visible:ring-0 font-medium text-foreground text-sm"
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
                  messageText.trim() ? "bg-primary text-white scale-100" : "bg-muted text-muted-foreground scale-90"
                )}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Panel de Info del Agente/Grupo */}
          {showInfo && (
            <div className="absolute inset-y-0 right-0 w-full sm:w-80 border-l border-border bg-card p-8 animate-in slide-in-from-right-4 duration-300 z-10">
              <div className="flex flex-col items-center text-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 rounded-xl text-muted-foreground"
                  onClick={() => setShowInfo(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
                <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-3xl font-black text-primary mb-6 shadow-inner">
                  {selectedChat.avatar}
                </div>
                <h4 className="text-xl font-black text-foreground tracking-tight">{selectedChat.name}</h4>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {selectedChat.type === 'group' ? `${selectedChat.participants.length} Miembros` : 'Agente de Ventas'}
                </p>
                
                <div className="grid grid-cols-2 gap-3 w-full mt-8">
                  <Button variant="outline" className="rounded-2xl border-border font-bold text-xs h-12 text-foreground">Perfil</Button>
                  <Button variant="outline" className="rounded-2xl border-border font-bold text-xs h-12 text-foreground">Archivos</Button>
                </div>

                <Separator className="my-8" />

                <div className="w-full space-y-6">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Miembros</p>
                    <div className="space-y-3">
                      {selectedChat.participants.map(pid => {
                        const p = getParticipantInfo(pid);
                        if (p?.id === currentUser.id) return null;
                        
                        return (
                          <button 
                            key={pid} 
                            onClick={() => {
                              const existingChat = chats.find(c => c.type === 'individual' && c.participants.includes(pid));
                              if (existingChat) {
                                handleSelectChat(existingChat.id);
                              }
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              {p?.avatar}
                            </div>
                            <div className="flex-1 overflow-hidden text-left">
                              <p className="text-xs font-black text-foreground truncate">{p?.name}</p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{p?.role}</p>
                            </div>
                            <MessageSquare className="w-3 h-3 text-muted group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
