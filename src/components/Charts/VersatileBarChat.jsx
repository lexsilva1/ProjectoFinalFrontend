import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FEF', '#EF82A2', '#82EFA2', '#A2EF82', '#FEA008', '#C400FE', '#28FFBB', '#4280FF'];

const VersatileBarChart = ({ data }) => {
  // Convert the HashMap to an array of objects for recharts
  const chartData = Object.keys(data).map(key => ({
    name: key,
    value: data[key]
  }));

  return (
    chartData.length > 0 ? (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value">
            {
              chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <p>No data available</p>
    )
  );
};

export default VersatileBarChart;