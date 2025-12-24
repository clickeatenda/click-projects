"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Notification, NotificationType } from '@/types/notification';
import { Issue } from '@/types/project';

// Generate notifications based on issues
function generateNotificationsFromIssues(issues: Issue[]): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  issues.forEach(issue => {
    // Blocked issues notification
    if (issue.status.toLowerCase().includes('bloquea') || issue.status === 'Bloqueado') {
      notifications.push({
        id: `blocked-${issue.id}`,
        type: 'blocked',
        title: 'Issue Bloqueada',
        message: `A issue "${issue.title}" está bloqueada e requer atenção`,
        issueId: issue.id,
        issueTitle: issue.title,
        project: issue.project,
        createdAt: issue.updatedAt || now.toISOString(),
        read: false,
      });
    }

    // Upcoming deadline (simulated - within 3 days)
    const issueDate = new Date(issue.createdAt);
    const daysSinceCreation = Math.floor((now.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation > 5 && issue.status !== 'Concluído' && issue.priority === 'Alta') {
      notifications.push({
        id: `deadline-${issue.id}`,
        type: 'deadline',
        title: 'Prazo Próximo',
        message: `A issue "${issue.title}" de alta prioridade está pendente há ${daysSinceCreation} dias`,
        issueId: issue.id,
        issueTitle: issue.title,
        project: issue.project,
        createdAt: now.toISOString(),
        read: false,
      });
    }

    // Recent assignment (issues created in last 24h)
    const hoursSinceCreation = (now.getTime() - issueDate.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation < 24 && issue.assignee) {
      notifications.push({
        id: `assignment-${issue.id}`,
        type: 'assignment',
        title: 'Nova Atribuição',
        message: `A issue "${issue.title}" foi atribuída a ${issue.assignee}`,
        issueId: issue.id,
        issueTitle: issue.title,
        project: issue.project,
        createdAt: issue.createdAt,
        read: false,
      });
    }
  });

  // Sort by date, most recent first
  return notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function useNotifications(issues: Issue[] = []) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Generate notifications from issues
  useEffect(() => {
    if (issues.length > 0) {
      const generated = generateNotificationsFromIssues(issues);
      setNotifications(prev => {
        // Merge with existing, keeping read status
        const merged = generated.map(n => ({
          ...n,
          read: readIds.has(n.id)
        }));
        return merged;
      });
    }
  }, [issues, readIds]);

  const markAsRead = useCallback((id: string) => {
    setReadIds(prev => new Set([...prev, id]));
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const allIds = prev.map(n => n.id);
      setReadIds(new Set(allIds));
      return prev.map(n => ({ ...n, read: true }));
    });
  }, []);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );

  const notificationsByType = useMemo(() => ({
    blocked: notifications.filter(n => n.type === 'blocked'),
    deadline: notifications.filter(n => n.type === 'deadline'),
    assignment: notifications.filter(n => n.type === 'assignment'),
    update: notifications.filter(n => n.type === 'update'),
  }), [notifications]);

  return {
    notifications,
    unreadCount,
    notificationsByType,
    markAsRead,
    markAllAsRead,
  };
}
