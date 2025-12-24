"use client";

import { useIssues } from '@/hooks/useIssues';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Suspense } from 'react';

function IssuesContent() {
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get('status');
    const priorityFilter = searchParams.get('priority');

    const { data: issues, isLoading } = useIssues();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredIssues = (issues || []).filter(issue => {
        if (statusFilter) {
            if (statusFilter === 'concluido' && !issue.status.toLowerCase().includes('conclu')) return false;
            if (statusFilter === 'aberto' && !issue.status.toLowerCase().includes('aberto')) return false;
            if (statusFilter === 'em-progresso' && !(issue.status.toLowerCase().includes('progresso') || issue.status.toLowerCase().includes('andamento'))) return false;
            if (statusFilter === 'bloqueado' && !issue.status.toLowerCase().includes('bloquea')) return false;
        }
        if (priorityFilter) {
            if (priorityFilter === 'urgente' && issue.priority !== 'Urgente') return false;
        }
        return true;
    });

    const getTitle = () => {
        if (statusFilter === 'concluido') return 'Issues Concluídas';
        if (statusFilter === 'aberto') return 'Issues Abertas';
        if (statusFilter === 'em-progresso') return 'Issues Em Progresso';
        if (statusFilter === 'bloqueado') return 'Issues Bloqueadas';
        if (priorityFilter === 'urgente') return 'Issues Urgentes';
        return 'Todas as Issues';
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{getTitle()}</h1>
                    <Badge variant="outline" className="ml-auto">
                        {filteredIssues.length} resultados
                    </Badge>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Projeto</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Prioridade</TableHead>
                                <TableHead>Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredIssues.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Nenhuma issue encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredIssues.map((issue) => (
                                    <TableRow key={issue.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col gap-1">
                                                <span>{issue.title}</span>
                                                <div className="flex gap-1">
                                                    {issue.tags.map(tag => (
                                                        <Badge key={tag} variant="secondary" className="text-[10px] px-1 h-5">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{issue.project}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                issue.status === 'Concluído' ? 'secondary' : // green?
                                                    issue.status === 'Bloqueado' ? 'destructive' :
                                                        issue.status === 'Em Progresso' ? 'default' :
                                                            'outline'
                                            }>
                                                {issue.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {issue.priority === 'Urgente' && <AlertCircle className="h-4 w-4 text-red-500" />}
                                                {issue.priority}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-muted-foreground text-sm">
                                                <Calendar className="mr-2 h-3 w-3" />
                                                {format(new Date(issue.updatedAt), "dd/MM/yyyy", { locale: ptBR })}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default function IssuesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <IssuesContent />
        </Suspense>
    );
}
