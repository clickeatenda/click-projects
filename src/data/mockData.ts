import { Issue, Project, DashboardStats } from '@/types/project';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Install and Configure Vercel Speed Insights',
    type: 'tarefa',
    status: 'Aberto',
    priority: 'Média',
    project: 'Click-Studio',
    tags: ['Aplicação WEB'],
    createdAt: '2025-12-21T13:51:00',
    updatedAt: '2025-12-21T13:51:00',
  },
  {
    id: '2',
    title: 'Testes unitarios (coverage > 70%)',
    type: 'tarefa',
    status: 'Aberto',
    priority: 'Média',
    project: 'Click-Channel-Final',
    tags: ['tarefa'],
    createdAt: '2025-12-22T09:43:00',
    updatedAt: '2025-12-22T09:43:00',
  },
  {
    id: '3',
    title: 'Criar documentação ENVIRONMENTS.md',
    type: 'tarefa',
    status: 'Aberto',
    priority: 'Média',
    project: 'Click-Studio-DEMO',
    tags: ['Aplicação WEB'],
    createdAt: '2025-12-21T18:43:00',
    updatedAt: '2025-12-21T18:43:00',
  },
  {
    id: '4',
    title: 'Add Vercel Web Analytics',
    type: 'feature',
    status: 'Em Progresso',
    priority: 'Alta',
    project: 'Click-Studio',
    tags: ['analytics'],
    createdAt: '2025-12-20T10:00:00',
    updatedAt: '2025-12-22T14:00:00',
  },
  {
    id: '5',
    title: 'Firestick - Detectar device e otimizar',
    type: 'melhoria',
    status: 'Aberto',
    priority: 'Alta',
    project: 'Click-Channel-Final',
    tags: ['device'],
    createdAt: '2025-12-19T15:30:00',
    updatedAt: '2025-12-19T15:30:00',
  },
  {
    id: '6',
    title: 'Configurar labels padrão nos repositórios',
    type: 'tarefa',
    status: 'Concluído',
    priority: 'Baixa',
    project: 'Click-Studio-DEMO',
    tags: ['config'],
    createdAt: '2025-12-18T11:00:00',
    updatedAt: '2025-12-22T09:00:00',
  },
  {
    id: '7',
    title: 'Fix memory leak on player component',
    type: 'bug',
    status: 'Bloqueado',
    priority: 'Alta',
    project: 'Click-Channel-Final',
    tags: ['bug', 'player'],
    createdAt: '2025-12-17T08:00:00',
    updatedAt: '2025-12-21T16:00:00',
  },
  {
    id: '8',
    title: 'Implementar cache de thumbnails',
    type: 'feature',
    status: 'Em Progresso',
    priority: 'Média',
    project: 'Click-Studio',
    tags: ['performance'],
    createdAt: '2025-12-16T14:00:00',
    updatedAt: '2025-12-22T11:00:00',
  },
  {
    id: '9',
    title: 'Setup CI/CD pipeline',
    type: 'tarefa',
    status: 'Concluído',
    priority: 'Alta',
    project: 'Click-Channel-Final',
    tags: ['devops'],
    createdAt: '2025-12-15T09:00:00',
    updatedAt: '2025-12-20T17:00:00',
  },
  {
    id: '10',
    title: 'Adicionar dark mode',
    type: 'feature',
    status: 'Aberto',
    priority: 'Baixa',
    project: 'Click-Studio',
    tags: ['UI'],
    createdAt: '2025-12-14T12:00:00',
    updatedAt: '2025-12-14T12:00:00',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'click-studio',
    name: 'Click-Studio',
    color: 'hsl(var(--chart-1))',
    issueCount: 20,
    completedCount: 8,
    issues: mockIssues.filter(i => i.project === 'Click-Studio'),
  },
  {
    id: 'click-channel-final',
    name: 'Click-Channel-Final',
    color: 'hsl(var(--chart-2))',
    issueCount: 36,
    completedCount: 15,
    issues: mockIssues.filter(i => i.project === 'Click-Channel-Final'),
  },
  {
    id: 'click-studio-demo',
    name: 'Click-Studio-DEMO',
    color: 'hsl(var(--chart-4))',
    issueCount: 13,
    completedCount: 6,
    issues: mockIssues.filter(i => i.project === 'Click-Studio-DEMO'),
  },
];

export const getStats = (): DashboardStats => {
  const totalIssues = mockIssues.length;
  const completedIssues = mockIssues.filter(i => i.status === 'Concluído').length;
  const openIssues = mockIssues.filter(i => i.status === 'Aberto').length;
  const inProgressIssues = mockIssues.filter(i => i.status === 'Em Progresso').length;
  const blockedIssues = mockIssues.filter(i => i.status === 'Bloqueado').length;

  return {
    totalProjects: mockProjects.length,
    totalIssues,
    completedIssues,
    openIssues,
    inProgressIssues,
    blockedIssues,
  };
};
