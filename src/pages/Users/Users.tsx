import React from 'react';
import { useTranslation } from 'react-i18next';

const Users: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">{t('common.users')}</h1>
        <p className="page-subtitle">{t('users.subtitle')}</p>
      </div>
      
      <div className="users-content">
        <div className="card">
          <div className="card-body">
            <h2>{t('users.title')}</h2>
            <p>User management system will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
