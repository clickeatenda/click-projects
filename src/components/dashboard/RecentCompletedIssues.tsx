"use client";

import { Issue } from "@/types/project";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface RecentCompletedIssuesProps {
    issues: Issue[];
}

export function RecentCompletedIssues({ issues }: RecentCompletedIssuesProps) {
    // Filter concluded issues and sort by update date (desc)
    const completedIssues = issues
        .filter((i) => i.status.toLowerCase().includes("conclu"))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    return (
        <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Últimas Conclusões
                </h3>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/issues?status=concluido" className="text-xs text-muted-foreground hover:text-primary">
                        Ver todas <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                {completedIssues.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma issue concluída recentemente.</p>
                ) : (
                    completedIssues.map((issue) => (
                        <div key={issue.id} className="flex items-start justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{issue.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-medium text-primary/80">{issue.project}</span>
                                    <span>•</span>
                                    <span>{format(new Date(issue.updatedAt), "d 'de' MMM, HH:mm", { locale: ptBR })}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
