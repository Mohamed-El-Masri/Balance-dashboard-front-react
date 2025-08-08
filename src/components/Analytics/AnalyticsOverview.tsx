import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemAnalytics, UnitAnalytics, FavoritesAnalytics, InterestsAnalytics } from '../../services/analyticsService';
import { TrendingUp, Users, Building, Briefcase, DollarSign, Heart } from 'lucide-react';

interface AnalyticsOverviewProps {
  analytics: SystemAnalytics;
  unitAnalytics?: UnitAnalytics;
  favoritesAnalytics?: FavoritesAnalytics;
  interestsAnalytics?: InterestsAnalytics;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ 
  analytics, 
  unitAnalytics, 
  favoritesAnalytics, 
  interestsAnalytics 
}) => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('common.projects'),
      value: analytics.projects,
      icon: Building,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      details: `${analytics.activeProjects} ${t('dashboard.active')} | ${analytics.projects - analytics.activeProjects} ${t('dashboard.inactive')}`
    },
    {
      title: t('common.units'),
      value: analytics.units,
      icon: Briefcase,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      details: unitAnalytics ? 
        `${unitAnalytics.availableUnits + unitAnalytics.soldUnits + unitAnalytics.reservedUnits + unitAnalytics.underConstructionUnits} ${t('dashboard.active')} | ${unitAnalytics.totalUnits - (unitAnalytics.availableUnits + unitAnalytics.soldUnits + unitAnalytics.reservedUnits + unitAnalytics.underConstructionUnits)} ${t('dashboard.inactive')}` 
        : `${analytics.units} ${t('dashboard.total')}`
    },
    {
      title: t('common.users'),
      value: analytics.users,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      details: `${analytics.superAdmins || 0} ${t('roles.superAdmin')} | ${analytics.admins || 0} ${t('roles.admin')} | ${analytics.employees || 0} ${t('roles.employee')} | ${analytics.regularUsers || 0} ${t('roles.user')}`
    },
    {
      title: t('dashboard.favorites'),
      value: favoritesAnalytics?.totalFavorites || 0,
      icon: Heart,
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      details: favoritesAnalytics ? 
        `${favoritesAnalytics.projectFavorites} ${t('common.projects')} | ${favoritesAnalytics.unitFavorites} ${t('dashboard.properties')}` 
        : `${t('common.loading')}...`
    },
    {
      title: t('dashboard.interests'),
      value: interestsAnalytics?.totalInterests || 0,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      details: interestsAnalytics ? 
        `${interestsAnalytics.projectInterests} ${t('common.projects')} | ${interestsAnalytics.unitInterests} ${t('dashboard.properties')}` 
        : `${t('common.loading')}...`
    },
    ...(analytics.totalRevenue ? [{
      title: t('dashboard.revenue'),
      value: `$${analytics.totalRevenue?.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      details: t('dashboard.totalRevenue')
    }] : [])
  ];

  return (
    <div className="analytics-overview">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="overview-card">
            <div className="card-icon">
              <Icon className="w-6 h-6" />
            </div>
            <div className="card-value">
              {typeof card.value === 'string' ? card.value : card.value.toLocaleString()}
            </div>
            <div className="card-label">{card.title}</div>
            <div className="card-change positive">
              <TrendingUp className="w-4 h-4" />
              <span>{card.details}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsOverview;
