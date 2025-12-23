"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Issue } from '@/types/project';
import { subDays, format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityChartProps {
  issues?: Issue[];
}

export function ActivityChart({ issues = [] }: ActivityChartProps) {
  // Calculate last 7 days activity
  const data = Array.from({ length: 7 }).map((_, index) => {
    const date = subDays(new Date(), 6 - index);
    const dateStr = format(date, 'EEE', { locale: ptBR });

    // Count created and completed on this day
    const createdCount = issues.filter(i => {
      if (!i.createdAt) return false;
      return isSameDay(parseISO(i.createdAt), date);
    }).length;

    const completedCount = issues.filter(i => {
      // Notion usually updates 'Last edited time' when status changes to Done. 
      // Ideally we would have a 'completedAt' field, but for now using updatedAt if status is done.
      if (!i.updatedAt || !i.status.toLowerCase().includes('conclu')) return false;
      return isSameDay(parseISO(i.updatedAt), date);
    }).length;

    return {
      name: dateStr.charAt(0).toUpperCase() + dateStr.slice(1), // Capitalize
      concluidas: completedCount,
      criadas: createdCount
    };
  });

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <h3 className="mb-4 font-semibold">Atividade Semanal</h3>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorConcluidas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCriadas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 22%)" />
            <XAxis
              dataKey="name"
              stroke="hsl(215, 16%, 55%)"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(215, 16%, 55%)"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 18%, 14%)',
                border: '1px solid hsl(220, 13%, 22%)',
                borderRadius: '8px',
                color: 'hsl(210, 20%, 95%)'
              }}
            />
            <Area
              type="monotone"
              dataKey="concluidas"
              stroke="hsl(142, 71%, 45%)"
              fillOpacity={1}
              fill="url(#colorConcluidas)"
              name="Concluídas"
            />
            <Area
              type="monotone"
              dataKey="criadas"
              stroke="hsl(199, 89%, 48%)"
              fillOpacity={1}
              fill="url(#colorCriadas)"
              name="Criadas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Concluídas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Criadas</span>
        </div>
      </div>
    </div>
  );
}
