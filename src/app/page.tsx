"use client";

import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { MacroView } from '@/components/dashboard/MacroView';
import { MicroView } from '@/components/dashboard/MicroView';
import { useIssues } from '@/hooks/useIssues';

export default function Home() {
  const [currentView, setCurrentView] = useState<'macro' | 'micro'>('macro');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { data: issues = [] } = useIssues();

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentView('micro');
    console.log("Selecionado:", projectId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        issues={issues}
      />

      <main className="container py-8">
        {currentView === 'macro' ? (
          <MacroView onSelectProject={handleSelectProject} />
        ) : (
          <MicroView />
        )}
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 Dashboard Executivo</p>
          <p>Integração Notion + Next.js</p>
        </div>
      </footer>
    </div>
  );
}