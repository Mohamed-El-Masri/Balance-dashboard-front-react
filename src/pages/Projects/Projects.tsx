import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects, useLocationData } from '../../hooks/useProjects';
import { ProjectFilters } from '../../services/projectService';
import ProjectsChart from './ProjectsChart';
import './Projects.css';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const pageSize = 10;

  // Build filters object
  const filters: ProjectFilters = {
    pageNumber: currentPage,
    pageSize,
    ...(searchTerm && { search: searchTerm }),
    ...(selectedRegion && { regionId: parseInt(selectedRegion) }),
    ...(selectedCity && { cityId: parseInt(selectedCity) }),
    ...(selectedStatus && { status: selectedStatus }),
    ...(selectedType && { type: selectedType }),
  };

  const {
    projects,
    totalItems,
    totalPages,
    isLoading,
    error,
    setFilters,
    clearError
  } = useProjects(filters);

  const {
    cities,
    regions,
    districts,
    getDistricts,
    isLoading: locationLoading
  } = useLocationData();

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    setFilters({ ...filters, pageNumber: 1 });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ProjectFilters>) => {
    setCurrentPage(1);
    setFilters({ ...filters, ...newFilters, pageNumber: 1 });
  };

  // Handle city change to load districts
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    if (cityId) {
      getDistricts(parseInt(cityId));
    }
    handleFilterChange({ cityId: cityId ? parseInt(cityId) : undefined });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters({ ...filters, pageNumber: page });
  };

  const getStatusBadgeClass = (status: string) => {
    const statusClasses = {
      'active': 'status-active',
      'planning': 'status-planning',
      'in-progress': 'status-progress',
      'completed': 'status-completed'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge';
  };

  const getTypeBadgeClass = (type: string) => {
    return 'type-badge';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  if (error) {
    return (
      <div className="projects-page">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-red-600 mb-2">{t('common.error')}</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={clearError} className="btn btn-primary">
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">{t('common.projects')}</h1>
          <p className="page-subtitle">
            {t('projects.manageDescription')}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="projects-controls">
        <div className="search-section">
          <div className="search-input">
            <input
              type="text"
              placeholder={t('projects.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-icon">
              🔍
            </button>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <select 
              value={selectedRegion} 
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                handleFilterChange({ regionId: e.target.value ? parseInt(e.target.value) : undefined });
              }}
              disabled={locationLoading}
            >
              <option value="">{t('projects.allRegions')}</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={selectedCity} 
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={locationLoading}
            >
              <option value="">{t('projects.allCities')}</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={selectedStatus} 
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                handleFilterChange({ status: e.target.value || undefined });
              }}
            >
              <option value="">{t('projects.allStatuses')}</option>
              <option value="active">{t('projects.active')}</option>
              <option value="planning">{t('projects.planning')}</option>
              <option value="in-progress">{t('projects.inProgress')}</option>
              <option value="completed">{t('projects.completed')}</option>
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={selectedType} 
              onChange={(e) => {
                setSelectedType(e.target.value);
                handleFilterChange({ type: e.target.value || undefined });
              }}
            >
              <option value="">{t('projects.allTypes')}</option>
              <option value="apartment">{t('projects.apartment')}</option>
              <option value="villa">{t('projects.villa')}</option>
              <option value="office">{t('projects.office')}</option>
              <option value="retail">{t('projects.retail')}</option>
              <option value="mixed">{t('projects.mixed')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {projects.length > 0 && (
        <div className="charts-section">
          <div className="card">
            <div className="card-header">
              <h3>{t('projects.analytics')}</h3>
            </div>
            <div className="card-body">
              <p>{t('projects.chartComingSoon')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="projects-table-container">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-balance-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">{t('common.loading')}</p>
          </div>
        ) : (
          <>
            <table className="projects-table">
              <thead>
                <tr>
                  <th>{t('projects.projectName')}</th>
                  <th>{t('projects.location')}</th>
                  <th>{t('projects.type')}</th>
                  <th>{t('projects.status')}</th>
                  <th>{t('projects.units')}</th>
                  <th>{t('projects.completion')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-info">
                        <div className="project-icon">🏗️</div>
                        <div>
                          <div className="project-name">{project.title}</div>
                          <div className="project-description">{project.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>{project.location || `${project.city}, ${project.region}`}</td>
                    <td>
                      <span className={`type-badge ${getTypeBadgeClass(project.type)}`}>
                        {t(`projects.${project.type}`)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(project.status)}`}>
                        {t(`projects.${project.status}`)}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{t('projects.total')}: {project.totalUnits || 0}</div>
                        <div className="text-green-600">{t('projects.available')}: {project.availableUnits || 0}</div>
                        <div className="text-blue-600">{t('projects.sold')}: {project.soldUnits || 0}</div>
                      </div>
                    </td>
                    <td>
                      {project.completionDate ? formatDate(project.completionDate) : t('projects.notSet')}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title={t('common.view')}>
                          👁️
                        </button>
                        <button className="action-btn" title={t('common.edit')}>
                          ✏️
                        </button>
                        <button className="action-btn danger" title={t('common.delete')}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  {t('projects.showing')} {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalItems)} {t('projects.of')} {totalItems}
                </div>
                <div className="pagination-controls">
                  <button
                    className="btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    {t('common.previous')}
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        className={`btn ${currentPage === page ? 'btn-primary' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    className="btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    {t('common.next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
