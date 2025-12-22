import { StatsCard } from './StatsCard';
import { ProjectCard } from './ProjectCard';
import { StatusChart } from './StatusChart';
import { ActivityChart } from './ActivityChart';
import { mockProjects, getStats } from '@/data/mockData';
import { 
  FolderKanban, 
  ListTodo, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Ban
} from 'lucide-react';

interface MacroViewProps {
  onSelectProject?: (projectId: string) => void;
}

export function MacroView({ onSelectProject }: MacroViewProps) {
  const stats = getStats();

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Visão Geral</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatsCard
            title="Projetos"
            value={stats.totalProjects}
            icon={FolderKanban}
            variant="primary"
          />
          <StatsCard
            title="Total Issues"
            value={stats.totalIssues}
            icon={ListTodo}
            variant="default"
          />
          <StatsCard
            title="Concluídas"
            value={stats.completedIssues}
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Abertas"
            value={stats.openIssues}
            icon={AlertCircle}
            variant="primary"
          />
          <StatsCard
            title="Em Progresso"
            value={stats.inProgressIssues}
            icon={Loader2}
            variant="warning"
          />
          <StatsCard
            title="Bloqueadas"
            value={stats.blockedIssues}
            icon={Ban}
            variant="destructive"
          />
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Projetos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onClick={() => onSelectProject?.(project.id)}
            />
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Analytics</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <StatusChart stats={stats} />
          <ActivityChart />
        </div>
      </section>
    </div>
  );
}
