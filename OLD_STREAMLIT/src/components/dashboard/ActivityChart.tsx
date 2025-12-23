import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Seg', concluidas: 4, criadas: 6 },
  { name: 'Ter', concluidas: 3, criadas: 4 },
  { name: 'Qua', concluidas: 5, criadas: 3 },
  { name: 'Qui', concluidas: 2, criadas: 7 },
  { name: 'Sex', concluidas: 6, criadas: 5 },
  { name: 'Sáb', concluidas: 1, criadas: 2 },
  { name: 'Dom', concluidas: 0, criadas: 1 },
];

export function ActivityChart() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <h3 className="mb-4 font-semibold">Atividade Semanal</h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorConcluidas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCriadas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0}/>
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
