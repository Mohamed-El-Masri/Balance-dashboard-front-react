import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Project } from '../../types';

interface ProjectsChartProps {
  projects: Project[];
}

const ProjectsChart: React.FC<ProjectsChartProps> = ({ projects }) => {
  const { t } = useTranslation();

  // Data for status chart
  const statusData = [
    {
      name: t('common.active'),
      value: projects.filter(p => p.status === 'active').length,
      color: 'var(--status-active)'
    },
    {
      name: t('projects.inProgress'),
      value: projects.filter(p => p.status === 'in-progress').length,
      color: 'var(--status-progress)'
    },
    {
      name: t('projects.planning'),
      value: projects.filter(p => p.status === 'planning').length,
      color: 'var(--status-planning)'
    },
    {
      name: t('common.completed'),
      value: projects.filter(p => p.status === 'completed').length,
      color: 'var(--status-completed)'
    }
  ];

  // Data for type chart
  const typeData = [
    {
      name: t('projects.apartment'),
      value: projects.filter(p => p.type === 'apartment').length
    },
    {
      name: t('projects.office'),
      value: projects.filter(p => p.type === 'office').length
    },
    {
      name: t('projects.villa'),
      value: projects.filter(p => p.type === 'villa').length
    },
    {
      name: t('projects.retail'),
      value: projects.filter(p => p.type === 'retail').length
    },
    {
      name: t('projects.mixed'),
      value: projects.filter(p => p.type === 'mixed').length
    }
  ].filter(item => item.value > 0); // Only show types that have projects

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      {/* Projects by Status Chart */}
      <div className="card">
        <div className="card-header">
          <h3>{t('projects.byStatus')}</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects by Type Chart */}
      <div className="card">
        <div className="card-header">
          <h3>{t('projects.byType')}</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Bar 
                dataKey="value" 
                fill="var(--balance-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default ProjectsChart;
