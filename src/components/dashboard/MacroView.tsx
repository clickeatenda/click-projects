"use client";
import { StatsCard } from './StatsCard';
import { ProjectCard } from './ProjectCard';
import { StatusChart } from './StatusChart';
import { ActivityChart } from './ActivityChart';
import { RecentCompletedIssues } from './RecentCompletedIssues';
import { useIssues, getStatsFromIssues, getProjectsFromIssues } from '@/hooks/useIssues';
import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Ban,
  Flame // Using Flame for Urgent
} from 'lucide-react';

interface MacroViewProps {
  onSelectProject?: (projectId: string) => void;
}

export function MacroView({ onSelectProject }: MacroViewProps) {
  const { data: issues, isLoading, error } = useIssues();

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-destructive">
        Erro ao carregar dados. Tente atualizar.
      </div>
    );
  }

  const safeIssues = issues || [];
  const stats = getStatsFromIssues(safeIssues);
  const projects = getProjectsFromIssues(safeIssues);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Visão Geral</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 grid-rows-2 xl:grid-rows-1">
          <StatsCard
            title="Total Issues"
            value={stats.totalIssues}
            icon={ListTodo}
            variant="default"
            href="/issues"
          />
          <StatsCard
            title="Urgentes"
            value={stats.urgentIssues}
            icon={Flame}
            variant="destructive"
            href="/issues?priority=urgente"
          />
          <StatsCard
            title="Concluídas"
            value={stats.completedIssues}
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 12, isPositive: true }}
            href="/issues?status=concluido"
          />
          <StatsCard
            title="Abertas"
            value={stats.openIssues}
            icon={AlertCircle}
            variant="primary"
            href="/issues?status=aberto"
          />
          <StatsCard
            title="Em Progresso"
            value={stats.inProgressIssues}
            icon={Loader2}
            variant="warning"
            href="/issues?status=em-progresso"
          />
          <StatsCard
            title="Bloqueadas"
            value={stats.blockedIssues}
            icon={Ban}
            variant="destructive"
            href="/issues?status=bloqueado"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content (Charts & Projects) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Charts Section */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Analytics</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <StatusChart stats={stats} />
              <ActivityChart issues={safeIssues} />
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Projetos Ativos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onSelectProject?.(project.id)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar (Recent Activity) */}
        <div className="xl:col-span-1">
          <section>
            <h2 className="mb-4 text-lg font-semibold">Atividade Recente</h2>
            <RecentCompletedIssues issues={safeIssues} />
          </section>
        </div>
      </div>
    </div>
  );
}
