import { useState } from 'react';
import { ProjectColumn } from './ProjectColumn';
import { mockProjects } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, SortAsc } from 'lucide-react';

export function MicroView() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-secondary/50">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="aberto">Aberto</SelectItem>
              <SelectItem value="em-progresso">Em Progresso</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="bloqueado">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2">
            <SortAsc className="h-4 w-4" />
            Ordenar
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {mockProjects.reduce((acc, p) => acc + p.issues.length, 0)} issues em {mockProjects.length} projetos
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-4 lg:grid-cols-3" style={{ minHeight: '600px' }}>
        {mockProjects.map((project) => (
          <ProjectColumn key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
