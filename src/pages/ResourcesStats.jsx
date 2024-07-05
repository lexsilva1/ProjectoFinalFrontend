import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Cookies from 'js-cookie';
import { getStatistics } from '../services/projectServices';

const ResourcesStats = () => {
  const [data, setData] = useState(null);
  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getStatistics(token);
        setData(stats);
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      }
    };

    fetchData();
  }, [token]);

  if (!data) return <div>Loading...</div>;

  // Prepare data for resourceQuantityPerProject chart
  const resourceQuantityData = Object.entries(data.resourceQuantityPerProject)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Prepare data for mostCommonResourcesByLab chart
  const mostCommonResourcesData = Object.entries(data.mostCommonResourcesByLab)
    .map(([lab, resource]) => ({ lab, resource }));

  // Prepare data for allResourcesByLab chart
  const allResourcesData = Object.entries(data.allResourcesByLab)
    .map(([lab, resources]) => {
      return Object.entries(resources)
        .map(([resource, count]) => ({ lab, resource, count }));
    })
    .flat()
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Group by resource for bar chart
  const allResourcesBarData = allResourcesData.reduce((acc, { resource, count }) => {
    acc[resource] = (acc[resource] || 0) + count;
    return acc;
  }, {});

  const topResourcesBarData = Object.entries(allResourcesBarData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([resource, count]) => ({ resource, count }));

  return (
    <div>
      <h2>Project Resource Quantities</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={resourceQuantityData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <Bar dataKey="value" fill="#8884d8">
            {resourceQuantityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            ))}
          </Bar>
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>

      <h2>Most Common Resources by Lab</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={mostCommonResourcesData}
            dataKey="resource"
            nameKey="lab"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {mostCommonResourcesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <h2>Top 5 Resources Across Labs</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topResourcesBarData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <Bar dataKey="count" fill="#82ca9d">
            {topResourcesBarData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            ))}
          </Bar>
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourcesStats;
