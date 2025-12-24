"use client";

import { useState } from 'react';
import { Notification, NotificationType } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Bell, 
  Ban, 
  Clock, 
  UserPlus, 
  RefreshCw,
  Check,
  CheckCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  notificationsByType: Record<NotificationType, Notification[]>;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; label: string }> = {
  blocked: { icon: Ban, color: 'text-destructive bg-destructive/10', label: 'Bloqueadas' },
  deadline: { icon: Clock, color: 'text-warning bg-warning/10', label: 'Prazos' },
  assignment: { icon: UserPlus, color: 'text-primary bg-primary/10', label: 'Atribuições' },
  update: { icon: RefreshCw, color: 'text-success bg-success/10', label: 'Atualizações' },
};

function NotificationItem({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
}) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "group relative flex gap-3 p-3 rounded-lg border border-border/50 transition-all duration-200 hover:bg-secondary/50",
        !notification.read && "bg-primary/5 border-primary/20"
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", config.color)}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-tight">{notification.title}</p>
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {notification.project && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {notification.project}
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </span>
        </div>
      </div>
      
      {!notification.read && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
      )}
    </div>
  );
}

export function NotificationPanel({
  notifications,
  unreadCount,
  notificationsByType,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} novas
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs gap-1"
              onClick={onMarkAllAsRead}
            >
              <CheckCheck className="h-3 w-3" />
              Marcar todas
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-9 p-0 px-2">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Todas
            </TabsTrigger>
            <TabsTrigger value="blocked" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Bloqueadas
            </TabsTrigger>
            <TabsTrigger value="deadline" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Prazos
            </TabsTrigger>
            <TabsTrigger value="assignment" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Atribuições
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-80">
            <TabsContent value="all" className="m-0 p-2 space-y-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="blocked" className="m-0 p-2 space-y-2">
              {notificationsByType.blocked.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Ban className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma issue bloqueada</p>
                </div>
              ) : (
                notificationsByType.blocked.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="deadline" className="m-0 p-2 space-y-2">
              {notificationsByType.deadline.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Nenhum prazo próximo</p>
                </div>
              ) : (
                notificationsByType.deadline.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="assignment" className="m-0 p-2 space-y-2">
              {notificationsByType.assignment.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <UserPlus className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma nova atribuição</p>
                </div>
              ) : (
                notificationsByType.assignment.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}