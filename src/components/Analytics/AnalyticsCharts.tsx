import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectAnalytics, UnitAnalytics } from '../../services/analyticsService';
import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsChartsProps {
  projectAnalytics: ProjectAnalytics;
  unitAnalytics: UnitAnalytics;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ 
  projectAnalytics, 
  unitAnalytics 
}) => {
  const { t } = useTranslation();

  // Project status data for pie chart (using statusCounts for detailed breakdown)
  const projectStatusData = [
    { name: t('dashboard.active'), value: projectAnalytics.activeProjects, color: '#B58863' },
    { name: t('common.completed'), value: projectAnalytics.completedProjects, color: '#10B981' },
    { name: t('dashboard.inProgress'), value: projectAnalytics.inProgressProjects, color: '#F59E0B' },
    { name: t('dashboard.planning'), value: projectAnalytics.planningProjects, color: '#8B5CF6' },
  ];

  // Project active/inactive breakdown
  const projectActiveData = [
    { name: t('dashboard.active'), value: projectAnalytics.activeProjects, color: '#10B981' },
    { name: t('dashboard.inactive'), value: projectAnalytics.totalProjects - projectAnalytics.activeProjects, color: '#6B7280' },
  ];

  // Unit status data for pie chart
  const unitStatusData = [
    { name: t('dashboard.available'), value: unitAnalytics.availableUnits, color: '#10B981' },
    { name: t('dashboard.sold'), value: unitAnalytics.soldUnits, color: '#B58863' },
    { name: t('dashboard.reserved'), value: unitAnalytics.reservedUnits, color: '#F59E0B' },
    { name: t('dashboard.underConstruction'), value: unitAnalytics.underConstructionUnits, color: '#6B7280' },
  ];

  // Unit active/inactive breakdown
  const unitActiveData = [
    { name: t('dashboard.active'), value: unitAnalytics.availableUnits + unitAnalytics.soldUnits + unitAnalytics.reservedUnits + unitAnalytics.underConstructionUnits, color: '#10B981' },
    { name: t('dashboard.inactive'), value: unitAnalytics.totalUnits - (unitAnalytics.availableUnits + unitAnalytics.soldUnits + unitAnalytics.reservedUnits + unitAnalytics.underConstructionUnits), color: '#6B7280' },
  ];

  // Project types data for pie chart
  const projectTypesData = [
    { name: t('projectTypes.commercial'), value: projectAnalytics.projectsByType.commercial, color: '#B58863' },
    { name: t('projectTypes.residential'), value: projectAnalytics.projectsByType.residential, color: '#10B981' },
    { name: t('projectTypes.educational'), value: projectAnalytics.projectsByType.educational, color: '#F59E0B' },
    { name: t('projectTypes.healthcare'), value: projectAnalytics.projectsByType.healthcare, color: '#8B5CF6' },
    { name: t('projectTypes.recreational'), value: projectAnalytics.projectsByType.recreational, color: '#06B6D4' },
    { name: t('projectTypes.industrial'), value: projectAnalytics.projectsByType.industrial, color: '#84CC16' },
    { name: t('projectTypes.governmental'), value: projectAnalytics.projectsByType.governmental, color: '#F97316' },
    { name: t('projectTypes.service'), value: projectAnalytics.projectsByType.service, color: '#EF4444' },
    { name: t('projectTypes.infrastructure'), value: projectAnalytics.projectsByType.infrastructure, color: '#6366F1' },
  ]; // Show all types even if value is 0

  // Unit types data for pie chart
  const unitTypesData = [
    { name: t('unitTypes.apartment'), value: unitAnalytics.unitsByType.apartment, color: '#B58863' },
    { name: t('unitTypes.duplex'), value: unitAnalytics.unitsByType.duplex, color: '#10B981' },
    { name: t('unitTypes.penthouse'), value: unitAnalytics.unitsByType.penthouse, color: '#F59E0B' },
    { name: t('unitTypes.studio'), value: unitAnalytics.unitsByType.studio, color: '#8B5CF6' },
    { name: t('unitTypes.villa'), value: unitAnalytics.unitsByType.villa, color: '#06B6D4' },
  ]; // Show all types even if value is 0

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
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="analytics-charts">
      {/* Project Active/Inactive Distribution */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <PieChartIcon className="chart-icon" />
            {t('projects.activeStatus')}
          </h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectActiveData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectActiveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #B58863',
                  borderRadius: '8px',
                  fontFamily: 'inherit'
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Status Distribution */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <PieChartIcon className="chart-icon" />
            {t('projects.byStatus')}
          </h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #B58863',
                  borderRadius: '8px',
                  fontFamily: 'inherit'
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unit Status Distribution */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <PieChartIcon className="chart-icon" />
            {t('units.byStatus')}
          </h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={unitStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {unitStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #B58863',
                  borderRadius: '8px',
                  fontFamily: 'inherit'
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unit Active/Inactive Distribution */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <PieChartIcon className="chart-icon" />
            {t('units.activeStatus')}
          </h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={unitActiveData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {unitActiveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #B58863',
                  borderRadius: '8px',
                  fontFamily: 'inherit'
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Types Distribution */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <PieChartIcon className="chart-icon" />
            {t('projects.byType')}
          </h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #B58863',
                  borderRadius: '8px',
                  fontFamily: 'inherit'
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unit Types Distribution */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">
            <PieChartIcon className="chart-icon" />
            {t('units.byType')}
          </h3>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={unitTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {unitTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #B58863',
                  borderRadius: '8px',
                  fontFamily: 'inherit'
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontFamily: 'inherit',
                  fontSize: '14px'
                  }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
