import { Project } from '@/types/project';
import { IssueCard } from './IssueCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectColumnProps {
  project: Project;
}

export function ProjectColumn({ project }: ProjectColumnProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border/50 bg-card/30">
      <div className="flex items-center gap-3 border-b border-border/50 p-4">
        <div 
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <h3 className="font-semibold">{project.name}</h3>
        <Badge variant="secondary" className="ml-auto">
          {project.issueCount}
        </Badge>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {project.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
