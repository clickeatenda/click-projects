import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  useEffect(() => {
    document.title = "Projeto em branco simples";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="flex min-h-screen items-center justify-center px-4">
        <section className="max-w-xl rounded-2xl border bg-card/80 p-8 shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-1 hover:shadow-xl">
          <header className="mb-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Projeto em branco</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Comece algo novo com uma base limpa
            </h1>
          </header>

          <p className="mb-8 text-sm text-muted-foreground">
            Esta tela é intencionalmente simples. Use este espaço para construir sua ideia, adicionar páginas,
            componentes e tudo o que o seu projeto precisar.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg">
              Começar agora
            </Button>
            <a
              href="https://docs.lovable.dev/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Ver documentação
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
