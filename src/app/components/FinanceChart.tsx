import React from 'react';
import Typography from '@mui/material/Typography';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Box } from '@mui/material';

interface MonthlyReport {
  id: string;
  month: string;
  totalContribuicoes: number;
  totalDebitos: number;
}

interface ChartProps {
  data: MonthlyReport[];
}

// Here we assume that `data` can have a default empty array if not provided
const FinanceChart: React.FC<ChartProps> = ({ data = [] }) => {
  return (
    <Box sx={{ width: "90%", backgroundColor: 'rgba(255, 255, 255, 0.9)', mt: "8px" }}>
      <Typography variant="h6" component="h2" style={{ textAlign: 'center', marginBottom: '16px', color: "black" }}>
        Relatório Financeiro Mensal
      </Typography>
      <ResponsiveContainer height={400} style={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="month" stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip formatter={(value: number) => value.toFixed(2)} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="totalContribuicoes" fill="#4158d0" barSize={20} radius={[10, 10, 0, 0]} />
          <Bar dataKey="totalDebitos" fill="#e11919" barSize={20} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default FinanceChart;
