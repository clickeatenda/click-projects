"use client";

import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { MacroView } from '@/components/dashboard/MacroView';
import { MicroView } from '@/components/dashboard/MicroView';

export default function Home() {
  const [currentView, setCurrentView] = useState<'macro' | 'micro'>('macro');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentView('micro');
    // TODO: Pass selectedProject to MicroView when implemented (Issue #19)
    console.log("Selecionado:", projectId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <main className="container py-8">
        {currentView === 'macro' ? (
          <MacroView onSelectProject={handleSelectProject} />
        ) : (
          <MicroView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 Dashboard Executivo</p>
          <p>Integração Notion + Next.js</p>
        </div>
      </footer>
    </div>
  );
}
