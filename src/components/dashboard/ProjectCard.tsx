import { Project } from '@/types/project';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const progress = Math.round((project.completedCount / project.issueCount) * 100);
  
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <FolderKanban 
              className="h-5 w-5" 
              style={{ color: project.color }} 
            />
          </div>
          <div>
            <h3 className="font-semibold transition-colors group-hover:text-primary">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {project.issueCount} issues
            </p>
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="mt-4 flex gap-2">
        <Badge variant="secondary" className="text-xs">
          {project.completedCount} concluídas
        </Badge>
        <Badge variant="outline" className="text-xs">
          {project.issueCount - project.completedCount} pendentes
        </Badge>
      </div>
    </div>
  );
}
