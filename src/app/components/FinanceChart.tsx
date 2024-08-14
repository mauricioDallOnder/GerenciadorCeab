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
  totalDoacoes: number;
  totalContasAPagar: number;
  totalVendas: number;
}

interface ChartProps {
  data?: MonthlyReport[]; // Tornar data opcional com um parâmetro padrão
}

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
          <Bar dataKey="totalContribuicoes" fill="#4158d0" barSize={20} radius={[10, 10, 0, 0]} name="Contribuições" />
          <Bar dataKey="totalDoacoes" fill="#ff6f61" barSize={20} radius={[10, 10, 0, 0]} name="Doações" />
          <Bar dataKey="totalContasAPagar" fill="#ffc107" barSize={20} radius={[10, 10, 0, 0]} name="Contas a Pagar" />
          <Bar dataKey="totalVendas" fill="#28a745" barSize={20} radius={[10, 10, 0, 0]} name="Vendas" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default FinanceChart;
