export type Priority = 'Alta' | 'Média' | 'Baixa' | 'Urgente';
export type Status = 'Aberto' | 'Em Progresso' | 'Concluído' | 'Bloqueado';
export type IssueType = 'tarefa' | 'bug' | 'feature' | 'melhoria';

export interface Issue {
  id: string;
  title: string;
  type: IssueType;
  status: Status;
  priority: Priority;
  project: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignee?: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  issueCount: number;
  completedCount: number;
  issues: Issue[];
}

export interface DashboardStats {
  totalProjects: number;
  totalIssues: number;
  completedIssues: number;
  openIssues: number;
  inProgressIssues: number;
  blockedIssues: number;
  urgentIssues: number;
}
