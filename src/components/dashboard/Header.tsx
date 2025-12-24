"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  LayoutDashboard, 
  Search, 
  Plus,
  Settings
} from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import { Issue } from '@/types/project';
import { useNotifications } from '@/hooks/useNotifications';

interface HeaderProps {
  onViewChange?: (view: 'macro' | 'micro') => void;
  currentView?: 'macro' | 'micro';
  issues?: Issue[];
}

export function Header({ onViewChange, currentView = 'macro', issues = [] }: HeaderProps) {
  const { 
    notifications, 
    unreadCount, 
    notificationsByType, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(issues);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Dashboard Executivo</h1>
              <p className="text-xs text-muted-foreground">Projetos Click e Atenda</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar issues..." 
              className="w-64 bg-secondary/50 pl-9 focus:bg-card"
            />
          </div>
          
          <div className="flex rounded-lg border border-border/50 bg-secondary/30 p-1">
            <Button
              variant={currentView === 'macro' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('macro')}
              className="text-xs"
            >
              Macro
            </Button>
            <Button
              variant={currentView === 'micro' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('micro')}
              className="text-xs"
            >
              Micro
            </Button>
          </div>

          <NotificationPanel
            notifications={notifications}
            unreadCount={unreadCount}
            notificationsByType={notificationsByType}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />

          <Button size="icon" variant="ghost">
            <Settings className="h-5 w-5" />
          </Button>

          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Issue</span>
          </Button>
        </div>
      </div>
    </header>
  );
}