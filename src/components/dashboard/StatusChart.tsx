import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DashboardStats } from '@/types/project';

interface StatusChartProps {
  stats: DashboardStats;
}

export function StatusChart({ stats }: StatusChartProps) {
  const data = [
    { name: 'Aberto', value: stats.openIssues, color: 'hsl(199, 89%, 48%)' },
    { name: 'Em Progresso', value: stats.inProgressIssues, color: 'hsl(38, 92%, 50%)' },
    { name: 'Concluído', value: stats.completedIssues, color: 'hsl(142, 71%, 45%)' },
    { name: 'Bloqueado', value: stats.blockedIssues, color: 'hsl(0, 72%, 51%)' },
  ].filter(d => d.value > 0);

  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <h3 className="mb-4 font-semibold">Distribuição por Status</h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(220, 18%, 14%)',
                border: '1px solid hsl(220, 13%, 22%)',
                borderRadius: '8px',
                color: 'hsl(210, 20%, 95%)'
              }}
            />
            <Legend 
              verticalAlign="bottom"
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
