import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { MacroView } from '@/components/dashboard/MacroView';
import { MicroView } from '@/components/dashboard/MicroView';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [currentView, setCurrentView] = useState<'macro' | 'micro'>('macro');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    setCurrentView('micro');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Executivo | Projetos Click e Atenda</title>
        <meta name="description" content="Dashboard executivo para visualização macro e micro dos projetos Click e Atenda, com integração Notion via n8n." />
      </Helmet>
      
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
            <p>Integração Notion + n8n + GitHub</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
