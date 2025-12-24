import { useQuery } from '@tanstack/react-query';
import { Issue, Project, DashboardStats } from '@/types/project';

async function fetchIssues(): Promise<Issue[]> {
    const res = await fetch('/api/notion/issues');
    if (!res.ok) {
        throw new Error('Failed to fetch issues');
    }
    return res.json();
}

export function useIssues() {
    return useQuery({
        queryKey: ['issues'],
        queryFn: fetchIssues,
        staleTime: 1000 * 60, // 1 minute
    });
}

// Helper to derive projects from issues
export function getProjectsFromIssues(issues: Issue[]): Project[] {
    const projectsMap = new Map<string, Project>();

    const colors = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];
    let colorIndex = 0;

    issues.forEach(issue => {
        if (!issue.project) return;

        if (!projectsMap.has(issue.project)) {
            projectsMap.set(issue.project, {
                id: issue.project, // Using name as ID for simplicity
                name: issue.project,
                color: colors[colorIndex % colors.length],
                issueCount: 0,
                completedCount: 0,
                issues: []
            });
            colorIndex++;
        }

        const project = projectsMap.get(issue.project)!;
        project.issueCount++;
        project.issues.push(issue);
        if (issue.status.toLowerCase().includes('conclu')) {
            project.completedCount++;
        }
    });

    return Array.from(projectsMap.values());
}

export function getStatsFromIssues(issues: Issue[]): DashboardStats {
    const projects = new Set(issues.filter(i => i.project).map(i => i.project));

    return {
        totalProjects: projects.size,
        totalIssues: issues.length,
        completedIssues: issues.filter(i => i.status.toLowerCase().includes('conclu')).length,
        openIssues: issues.filter(i => i.status.toLowerCase().includes('aberto')).length,
        inProgressIssues: issues.filter(i => i.status.toLowerCase().includes('andamento') || i.status.toLowerCase().includes('progresso')).length,
        blockedIssues: issues.filter(i => i.status.toLowerCase().includes('bloquea')).length,
        urgentIssues: issues.filter(i => i.priority === 'Urgente').length,
    };
}
