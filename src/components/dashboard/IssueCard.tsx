import { Issue, Priority, Status } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, AlertCircle, CheckCircle2, Loader2, Ban } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
}

const priorityColors: Record<Priority, string> = {
  Urgente: 'bg-destructive/30 text-destructive border-destructive/50',
  Alta: 'bg-destructive/20 text-destructive border-destructive/30',
  Média: 'bg-warning/20 text-warning border-warning/30',
  Baixa: 'bg-muted text-muted-foreground border-muted',
};

const statusConfig: Record<Status, { icon: typeof Clock; color: string }> = {
  Aberto: { icon: AlertCircle, color: 'text-primary' },
  'Em Progresso': { icon: Loader2, color: 'text-warning' },
  Concluído: { icon: CheckCircle2, color: 'text-success' },
  Bloqueado: { icon: Ban, color: 'text-destructive' },
};

const typeColors: Record<string, string> = {
  tarefa: 'bg-chart-1/20 text-chart-1',
  bug: 'bg-destructive/20 text-destructive',
  feature: 'bg-chart-2/20 text-chart-2',
  melhoria: 'bg-success/20 text-success',
};

export function IssueCard({ issue }: IssueCardProps) {
  const StatusIcon = statusConfig[issue.status].icon;
  
  return (
    <div className="group rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-border hover:bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant="outline" 
              className={cn('text-xs capitalize', typeColors[issue.type])}
            >
              {issue.type}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn('text-xs', priorityColors[issue.priority])}
            >
              {issue.priority}
            </Badge>
          </div>
          
          <h4 className="font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {issue.title}
          </h4>
          
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <div className={cn('flex items-center gap-1', statusConfig[issue.status].color)}>
              <StatusIcon className={cn('h-3.5 w-3.5', issue.status === 'Em Progresso' && 'animate-spin')} />
              <span>{issue.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{new Date(issue.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {issue.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {issue.tags.map((tag) => (
            <span 
              key={tag}
              className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
