import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { projectService, Project } from '../../services/projectService';
import { SafeLoading } from '../../components';
import './ProjectDetails.css';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, hasPermission } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRTL = i18n.language === 'ar';
  const isAdmin = hasPermission(['admin', 'superadmin']);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError(t('projects.invalidId'));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await projectService.getProject(parseInt(id));
        if (response.success && response.data) {
          setProject(response.data);
        } else {
          setError(t('projects.notFound'));
        }
      } catch (err: any) {
        setError(err.message || t('projects.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, t]);

  const handleBack = () => {
    navigate('/projects');
  };

  const handleEdit = () => {
    // Navigate to edit page - this would be implemented later
  };

  const handleDelete = async () => {
    if (!project || !isAdmin) return;

    const confirmDelete = window.confirm(
      t('projects.confirmDelete', { name: getProjectName() })
    );
    if (!confirmDelete) return;

    try {
      const response = await projectService.deleteProject(project.id);
      if (response.success) {
        navigate('/projects');
      }
    } catch (err) {
      // Handle error silently or show user-friendly message
    }
  };

  const getProjectName = () => {
    if (!project) return '';
    return isRTL ? project.nameAr : project.nameEn || project.title || `Project #${project.id}`;
  };

  const getProjectLocation = () => {
    if (!project) return '';
    return isRTL ? project.locationAr : project.locationEn || project.location || '';
  };

  if (isLoading) {
    return (
      <div className="project-details-page">
        <SafeLoading isLoading={true} error={null} isEmpty={false} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-details-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>{t('projects.error')}</h2>
          <p>{error || t('projects.notFound')}</p>
          <button className="btn btn-primary" onClick={handleBack}>
            {t('projects.backToList')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-navigation">
          <button className="back-btn" onClick={handleBack}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            {t('projects.backToList')}
          </button>
          <div className="breadcrumb">
            <span>{t('projects.title')}</span>
            <span className="separator">→</span>
            <span>{getProjectName()}</span>
          </div>
        </div>

        <div className="header-actions">
          {isAdmin && (
            <>
              <button className="btn btn-secondary" onClick={handleEdit}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V12.5a.5.5 0 0 0 .5.5h.793L11.207 9z"/>
                </svg>
                {t('projects.edit')}
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                </svg>
                {t('projects.delete')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="project-info">
        <div className="project-header-info">
          <div className="project-title-section">
            <h1 className="project-title">{getProjectName()}</h1>
            <span className={`status-badge ${project.isActive ? 'active' : 'inactive'}`}>
              {project.isActive ? t('dashboard.active') : t('dashboard.inactive')}
            </span>
          </div>
          
          {getProjectLocation() && (
            <div className="project-location">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              {getProjectLocation()}
            </div>
          )}
        </div>

        {/* Project Description */}
        {(project.descriptionAr || project.descriptionEn || project.description) && (
          <div className="project-description">
            <h3>{t('projects.description')}</h3>
            <p>
              {isRTL 
                ? project.descriptionAr 
                : project.descriptionEn || project.description
              }
            </p>
          </div>
        )}
      </div>

      {/* Project Statistics */}
      <div className="project-stats-section">
        <h3>{t('projects.statistics')}</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-value">{project.countOfUnits || 0}</div>
            <div className="stat-label">{t('projects.units')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-value">{project.favoritedUsersCount || 0}</div>
            <div className="stat-label">{t('projects.favorites')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-value">{project.interestedUsersCount || 0}</div>
            <div className="stat-label">{t('projects.interested')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{project.assignedEmployeeNames?.length || 0}</div>
            <div className="stat-label">{t('projects.employees')}</div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="project-details-grid">
        {/* Basic Information */}
        <div className="details-section">
          <h3>{t('projects.basicInfo')}</h3>
          <div className="details-content">
            {project.statusName && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.status')}:</span>
                <span className="detail-value">{project.statusName}</span>
              </div>
            )}
            {project.typeName && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.type')}:</span>
                <span className="detail-value">{project.typeName}</span>
              </div>
            )}
            {project.cost && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.cost')}:</span>
                <span className="detail-value">{project.cost.toLocaleString()}</span>
              </div>
            )}
            {project.area && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.area')}:</span>
                <span className="detail-value">
                  {project.area} {isRTL ? project.areaUnitAr : project.areaUnitEn}
                </span>
              </div>
            )}
            {project.parkingSpots && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.parking')}:</span>
                <span className="detail-value">{project.parkingSpots}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="details-section">
          <h3>{t('projects.locationDetails')}</h3>
          <div className="details-content">
            {project.regionName && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.region')}:</span>
                <span className="detail-value">{project.regionName}</span>
              </div>
            )}
            {project.cityName && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.city')}:</span>
                <span className="detail-value">{project.cityName}</span>
              </div>
            )}
            {project.districtName && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.district')}:</span>
                <span className="detail-value">{project.districtName}</span>
              </div>
            )}
            {(project.latitude && project.longitude) && (
              <div className="detail-item">
                <span className="detail-label">{t('projects.coordinates')}:</span>
                <span className="detail-value">
                  {project.latitude.toFixed(6)}, {project.longitude.toFixed(6)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Employees */}
      {project.assignedEmployeeNames && project.assignedEmployeeNames.length > 0 && (
        <div className="employees-section">
          <h3>{t('projects.assignedEmployees')}</h3>
          <div className="employees-grid">
            {project.assignedEmployeeNames.map((employeeName, index) => (
              <div key={index} className="employee-card">
                <div className="employee-avatar">
                  {employeeName.charAt(0).toUpperCase()}
                </div>
                <div className="employee-info">
                  <div className="employee-name">{employeeName}</div>
                  <div className="employee-role">
                    {t('projects.employee')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {project.notes && project.notes.length > 0 && (
        <div className="notes-section">
          <h3>{t('projects.notes')}</h3>
          <div className="notes-list">
            {project.notes.map((note, index) => (
              <div key={index} className="note-item">
                <div className="note-content">{note.content}</div>
                {note.createdAt && (
                  <div className="note-date">
                    {new Date(note.createdAt).toLocaleDateString(
                      isRTL ? 'ar-SA' : 'en-US'
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons for Mobile */}
      {isAdmin && (
        <div className="mobile-actions">
          <button className="btn btn-secondary" onClick={handleEdit}>
            {t('projects.edit')}
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            {t('projects.delete')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
