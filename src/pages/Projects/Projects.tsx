import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { projectService, Project, LocationData } from '../../services/projectService';
import { SafeLoading } from '../../components';
import './Projects.css';

interface ProjectFilters {
  search: string;
  statusId?: number;
  typeId?: number;
  regionId?: number;
  cityId?: number;
  districtId?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}


interface ProjectResponse {
  items: Project[];
  totalCountOfProjects: number;
  totalCountOfFeateredProjects: number;
  totalCountAssignedProjectToEmployee: number;
  totalCountOfActivedProjects: number;
  totalCountOfUnits: number;
}

interface ProjectStats {
  totalCountOfProjects: number;
  totalCountOfFeateredProjects: number;
  totalCountAssignedProjectToEmployee: number;
  totalCountOfActivedProjects: number;
  totalCountOfUnits: number;
}

const Projects: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, hasPermission } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]); // جميع المشاريع من API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    statusId: undefined,
    typeId: undefined,
    regionId: undefined,
    cityId: undefined,
    districtId: undefined,
    isActive: undefined,
    isFeatured: undefined
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState<ProjectStats>({
    totalCountOfProjects: 0,
    totalCountOfFeateredProjects: 0,
    totalCountAssignedProjectToEmployee: 0,
    totalCountOfActivedProjects: 0,
    totalCountOfUnits: 0
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [regions, setRegions] = useState<LocationData[]>([]);
  const [cities, setCities] = useState<LocationData[]>([]);
  const [districts, setDistricts] = useState<LocationData[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; projectId?: number; projectName?: string }>({
    isOpen: false,
    projectId: undefined,
    projectName: undefined
  });

  const isRTL = i18n.language === 'ar';
  const isEmployee = user?.role === 'employee' || user?.roleNames?.includes('Employee');
  const isAdmin = hasPermission(['admin', 'superadmin']);

  // جلب المناطق والمدن للفلترة
  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const [regionsResponse, citiesResponse] = await Promise.all([
          projectService.getRegions(),
          projectService.getCities()
        ]);
        
        if (regionsResponse.success && regionsResponse.data) {
          setRegions(regionsResponse.data);
        }
        if (citiesResponse.success && citiesResponse.data) {
          setCities(citiesResponse.data);
        }
      } catch (err) {
        // تجاهل أخطاء تحميل بيانات الموقع - ليست ضرورية لعمل الصفحة
      }
    };
    
    if (isAdmin) {
      loadLocationData();
    }
  }, [isAdmin]);

  // البيانات جاهزة بعد الفلترة من API والبحث المحلي
  const filteredProjects = projects;

  // جلب المشاريع باستخدام API الجديد
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // تحضير معاملات API وفقاً للدوكيمنتيشن
      const apiParams: any = {
        PageSize: pageSize
      };

      // إضافة Page parameter فقط إذا لم يكن هناك بحث
      if (!filters.search) {
        apiParams.Page = page;
      } else {
        // عند البحث، نجلب جميع البيانات من الصفحة الأولى بحجم أكبر
        apiParams.Page = 1;
        apiParams.PageSize = 1000; // أو رقم كبير لجلب جميع البيانات
      }

      // إضافة فلاتر الموقع إذا كانت موجودة
      if (filters.regionId) {
        apiParams.RegionId = filters.regionId;
      }
      if (filters.cityId) {
        apiParams.CityId = filters.cityId;
      }
      if (filters.districtId) {
        apiParams.DistrictId = filters.districtId;
      }

      // إضافة فلاتر أخرى إذا كانت موجودة وفقاً للدوكيمنتيشن
      if (filters.statusId) {
        apiParams.StatusId = filters.statusId;
      }

      if (filters.typeId) {
        apiParams.TypeId = filters.typeId;
      }

      if (filters.isActive !== undefined) {
        apiParams.IsActive = filters.isActive;
      }

      if (filters.isFeatured !== undefined) {
        apiParams.IsFeatured = filters.isFeatured;
      }

      let response;
      if (isEmployee) {
        response = await projectService.getAssignedProjects();
      } else {
        // استخدام API الجديد مع المعاملات
        response = await projectService.getProjects(apiParams);
      }

      if (response.success && response.data) {
        let projectsData: Project[] = [];
        let projectStats = {
          totalCountOfProjects: 0,
          totalCountOfFeateredProjects: 0,
          totalCountAssignedProjectToEmployee: 0,
          totalCountOfActivedProjects: 0,
          totalCountOfUnits: 0
        };

        // التعامل مع response وفقاً للدوكيمنتيشن
        if (Array.isArray(response.data)) {
          // للموظف - array مباشر
          projectsData = response.data;
          if (isEmployee) {
            projectStats = {
              totalCountOfProjects: projectsData.length,
              totalCountOfFeateredProjects: projectsData.filter(p => p.isFeatured).length,
              totalCountAssignedProjectToEmployee: projectsData.length,
              totalCountOfActivedProjects: projectsData.filter(p => p.isActive).length,
              totalCountOfUnits: projectsData.reduce((sum, p) => sum + (p.countOfUnits || 0), 0)
            };
          }
        } else {
          // للإدارة - response object مع items والإحصائيات
          projectsData = response.data.items || [];
          
          // استخراج الإحصائيات من الـ response كما هو محدد في الدوكيمنتيشن
          projectStats = {
            totalCountOfProjects: response.data.totalCountOfProjects || 0,
            totalCountOfFeateredProjects: response.data.totalCountOfFeateredProjects || 0,
            totalCountAssignedProjectToEmployee: response.data.totalCountAssignedProjectToEmployee || 0,
            totalCountOfActivedProjects: response.data.totalCountOfActivedProjects || 0,
            totalCountOfUnits: response.data.totalCountOfUnits || 0
          };
          
        }

        // حساب إجمالي الصفحات من إجمالي المشاريع
        const calculatedTotalPages = Math.ceil(projectStats.totalCountOfProjects / pageSize);
        
        // حفظ البيانات في state - عرض المشاريع مباشرة من الـ API
        setProjects(projectsData); // عرض مشاريع الصفحة الحالية مباشرة
        setAllProjects(projectsData); // حفظ للاستخدام في البحث المحلي
        setTotalPages(calculatedTotalPages);
        setTotalItems(projectStats.totalCountOfProjects);
        setStats(projectStats);
        
      } else {
        setError(t('projects.loadError'));
      }
    } catch (error) {
      setError(t('projects.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, pageSize, filters.regionId, filters.cityId, filters.districtId, filters.statusId, filters.typeId, filters.isActive, filters.isFeatured, filters.search, isEmployee]);

  // تطبيق البحث المحلي فقط عند وجود بحث نشط
  useEffect(() => {
    if (!allProjects.length || !filters.search) return;

    const searchTerm = filters.search.toLowerCase();
    const filteredProjects = allProjects.filter(project => {
      const projectName = isRTL ? project.nameAr : project.nameEn;
      return projectName?.toLowerCase().includes(searchTerm) ||
             project.descriptionAr?.toLowerCase().includes(searchTerm) ||
             project.descriptionEn?.toLowerCase().includes(searchTerm) ||
             project.id.toString().includes(searchTerm);
    });
    
    const finalTotalItems = filteredProjects.length;
    const finalTotalPages = Math.ceil(finalTotalItems / pageSize);

    // تطبيق pagination على النتائج المفلترة
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    setProjects(paginatedProjects);
    setTotalPages(finalTotalPages);
    setTotalItems(finalTotalItems);
  }, [allProjects, page, pageSize, filters.search, isRTL]);

  // إعادة تعيين الصفحة عند تغيير البحث
  useEffect(() => {
    if (filters.search !== '') {
      setPage(1);
    } else {
      // عند إيقاف البحث، عرض البيانات الأصلية
      fetchProjects();
    }
  }, [filters.search]);

  // تغيير حالة Featured للمشروع
  const toggleProjectFeatured = async (projectId: number, currentFeatured: boolean) => {
    try {
      const response = await projectService.setProjectFeatured(projectId, !currentFeatured);
      
      if (response.success) {
        // تحديث حالة المشروع في القائمة المحلية
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === projectId 
              ? { ...project, isFeatured: !currentFeatured }
              : project
          )
        );
      } else {
        setError(response.error || 'فشل في تغيير حالة المشروع المميز');
      }
    } catch (error) {
      setError('حدث خطأ أثناء تغيير حالة المشروع المميز');
    }
  };

  // تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // تغيير الفلاتر
  const handleFilterChange = (key: string, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // العودة للصفحة الأولى عند تغيير الفلاتر
  };

  // مسح الفلاتر
  const clearFilters = () => {
    setFilters({
      search: '',
      statusId: undefined,
      typeId: undefined,
      regionId: undefined,
      cityId: undefined,
      districtId: undefined,
      isActive: undefined,
      isFeatured: undefined
    });
    setPage(1);
  };

  // حذف مشروع
  const openDeleteModal = (projectId: number, projectName: string) => {
    setDeleteModal({
      isOpen: true,
      projectId,
      projectName
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      projectId: undefined,
      projectName: undefined
    });
  };

  const handleDeleteProject = async () => {
    if (deleteModal.projectId) {
      try {
        const response = await projectService.deleteProject(deleteModal.projectId);
        
        if (response.success) {
          await fetchProjects(); // إعادة تحميل المشاريع
          closeDeleteModal();
        } else {
          setError(response.error || 'فشل في حذف المشروع');
        }
      } catch (error) {
        setError('حدث خطأ أثناء حذف المشروع');
      }
    }
  };

  // تغيير حالة المشروع النشطة
  const handleToggleStatus = async (projectId: number, currentStatus: boolean) => {
    try {
      const response = await projectService.toggleProjectActive(projectId, !currentStatus);
      
      if (response.success) {
        // تحديث حالة المشروع في القائمة المحلية
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === projectId 
              ? { ...project, isActive: !currentStatus }
              : project
          )
        );
      } else {
        setError(response.error || 'فشل في تغيير حالة المشروع');
      }
    } catch (error) {
      setError('حدث خطأ أثناء تغيير حالة المشروع');
    }
  };

  // عرض حالة فارغة للموظفين
  if (isEmployee && !isLoading && projects.length === 0) {
    return (
      <div className="projects-page">
        <div className="page-header">
          <h1 className="page-title">{t('projects.title')}</h1>
          <p className="page-subtitle">{t('projects.employeeSubtitle')}</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h2 className="empty-state-title">{t('projects.noAssignedProjects')}</h2>
          <p className="empty-state-description">
            {t('projects.noAssigned')}
          </p>
        </div>
      </div>
    );
  }

  // رقم بداية ونهاية العرض
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="projects-page">
      {/* رأس الصفحة */}
      <div className="page-header">
        <h1 className="page-title">{t('projects.title')}</h1>
        <p className="page-subtitle">
          {isEmployee ? t('projects.employeeSubtitle') : t('projects.adminSubtitle')}
        </p>
        
        {/* إجراءات رأس الصفحة */}
        <div className="header-actions">
          {/* الصف الأول: البحث وأزرار العرض وإضافة مشروع */}
          <div className="header-actions-row">
            {/* البحث */}
            <div className="search-container">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder={t('projects.search')}
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            {/* تبديل العرض */}
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3A1.5 1.5 0 0 1 15 10.5v3A1.5 1.5 0 0 1 13.5 15h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
                {t('projects.gridView')}
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
                {t('projects.listView')}
              </button>
            </div>

            {/* زر إضافة مشروع - للإدارة فقط */}
            {isAdmin && (
              <button className="btn btn-primary add-project-btn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                {t('projects.addNew')}
              </button>
            )}
          </div>

          {/* الصف الثاني: الفلاتر - للإدارة فقط */}
          {isAdmin && (
            <div className="filters-section">
              <div className="filters-row">
                <select
                  className="filter-select"
                  value={filters.statusId || ''}
                  onChange={(e) => handleFilterChange('statusId', e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">{t('projects.allStatuses')}</option>
                  <option value="1">{t('dashboard.active')}</option>
                  <option value="2">{t('dashboard.planning')}</option>
                  <option value="3">{t('dashboard.inProgress')}</option>
                  <option value="4">{t('common.completed')}</option>
                </select>

                <select
                  className="filter-select"
                  value={filters.typeId || ''}
                  onChange={(e) => handleFilterChange('typeId', e.target.value ? parseInt(e.target.value) : undefined)}
                >
                  <option value="">{t('projects.allTypes')}</option>
                  <option value="1">{t('projects.apartment')}</option>
                  <option value="2">{t('projects.villa')}</option>
                  <option value="3">{t('projects.office')}</option>
                  <option value="6">{t('projects.commercial')}</option>
                </select>

                {regions.length > 0 && (
                  <select
                    className="filter-select"
                    value={filters.regionId || ''}
                    onChange={(e) => handleFilterChange('regionId', e.target.value)}
                  >
                    <option value="">{t('projects.allRegions')}</option>
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                )}

                {cities.length > 0 && (
                  <select
                    className="filter-select"
                    value={filters.cityId || ''}
                    onChange={(e) => handleFilterChange('cityId', e.target.value)}
                  >
                    <option value="">{t('projects.allCities')}</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                )}

                <button className="clear-filters-btn" onClick={clearFilters}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                  </svg>
                  {t('projects.clearFilters')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      {isAdmin && !isLoading && (
        <div className="projects-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.totalCountOfProjects}</div>
            <div className="stat-label">{t('projects.totalProjects')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalCountOfActivedProjects}</div>
            <div className="stat-label">{t('projects.activeProjects')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalCountOfFeateredProjects}</div>
            <div className="stat-label">{t('projects.featured')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalCountAssignedProjectToEmployee}</div>
            <div className="stat-label">{t('projects.assignedProjects')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalCountOfUnits}</div>
            <div className="stat-label">{t('projects.totalUnits')}</div>
          </div>
        </div>
      )}

      {/* محتوى المشاريع */}
      <div className="projects-content">
        <SafeLoading isLoading={isLoading} error={error} retry={fetchProjects}>
          {/* شبكة المشاريع */}
          <div className={`projects-grid ${viewMode}`}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                isRTL={isRTL}
                onToggleStatus={() => handleToggleStatus(project.id, project.isActive || false)}
                onToggleFeatured={() => toggleProjectFeatured(project.id, project.isFeatured || false)}
                onDelete={() => openDeleteModal(project.id, project.nameAr || project.nameEn || `Project #${project.id}`)}
                t={t}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              {/* تحكم في عدد العناصر في الصفحة */}
              <div className="page-size-selector">
                <label>{t('projects.itemsPerPage')}:</label>
                <select
                  className="filter-select page-size-select"
                  value={pageSize}
                  onChange={(e) => {
                    const newPageSize = Number(e.target.value);
                    setPageSize(newPageSize);
                    setPage(1); // العودة للصفحة الأولى
                  }}
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={18}>18</option>
                  <option value={24}>24</option>
                </select>
              </div>

              <div className="pagination">
                <button
                  className="pagination-btn nav-btn"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  title={t('projects.previous')}
                >
                  ‹
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page > totalPages - 3) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  if (pageNum === 1 && page > 3 && totalPages > 5) {
                    return (
                      <React.Fragment key="start-ellipsis">
                        <button
                          className="pagination-btn"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                        <span className="pagination-ellipsis">...</span>
                      </React.Fragment>
                    );
                  }

                  if (pageNum === totalPages && page < totalPages - 2 && totalPages > 5) {
                    return (
                      <React.Fragment key="end-ellipsis">
                        <span className="pagination-ellipsis">...</span>
                        <button
                          className="pagination-btn"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </React.Fragment>
                    );
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className="pagination-btn nav-btn"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  title={t('projects.next')}
                >
                  ›
                </button>
              </div>

              {/* Pagination Info */}
              <div className="pagination-info">
                {t('projects.showingEntries', { start: startItem, end: endItem, total: totalItems })}
              </div>
            </div>
          )}
        </SafeLoading>
      </div>

      {/* Modal تأكيد الحذف */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('projects.confirmDelete')}</h3>
              <button className="modal-close" onClick={closeDeleteModal}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-icon">
                <svg width="48" height="48" fill="currentColor" viewBox="0 0 16 16" className="text-danger">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </div>
              <p>{t('projects.deleteConfirmMessage', { projectName: deleteModal.projectName })}</p>
              <p className="text-muted">{t('projects.deleteWarning')}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeDeleteModal}>
                {t('common.cancel')}
              </button>
              <button className="btn btn-danger" onClick={handleDeleteProject}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
                {t('projects.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// مكون بطاقة المشروع
interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  isRTL: boolean;
  onToggleStatus: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
  t: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  isAdmin, 
  isRTL, 
  onToggleStatus, 
  onToggleFeatured,
  onDelete, 
  t 
}) => {
  const projectName = isRTL ? project.nameAr : project.nameEn;
  const location = isRTL ? project.locationAr : project.locationEn;

  return (
    <div className="project-card">
      {/* رأس البطاقة */}
      <div className="project-header">
        <div className="project-title">
          <span>{projectName || `${t('projects.title')} #${project.id}`}</span>
        </div>
        
        {/* البادجات تحت اسم المشروع */}
        <div className="project-badges">
          {/* Featured Badge */}
          {project.isFeatured && (
            <div className="featured-badge">
              ⭐ {t('projects.featured')}
            </div>
          )}

          {/* Active/Inactive Badge */}
          <div className={`active-badge ${project.isActive ? 'active' : 'inactive'}`}>
            {project.isActive ? t('dashboard.active') : t('dashboard.inactive')}
          </div>
        </div>
        {location && (
          <div className="project-location">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
            {location}
          </div>
        )}
        
        {/* معلومات إضافية */}
        <div className="project-meta">
          <div className="project-type">
            <span className="meta-label">{t('projects.type')}:</span>
            <span className="meta-value">{isRTL ? project.typeName : project.typeNameEn}</span>
          </div>
          {project.cost && (
            <div className="project-cost">
              <span className="meta-label">{t('projects.cost')}:</span>
              <span className="meta-value">{project.cost.toLocaleString()}</span>
            </div>
          )}
          {project.area && (
            <div className="project-area">
              <span className="meta-label">{t('projects.area')}:</span>
              <span className="meta-value">{project.area} {isRTL ? project.areaUnitAr : project.areaUnitEn}</span>
            </div>
          )}
          {/* معلومات الموقع الجديدة */}
          {project.regionName && (
            <div className="project-region">
              <span className="meta-label">{t('projects.region')}:</span>
              <span className="meta-value">{isRTL ? project.regionName : project.regionNameEn}</span>
            </div>
          )}
          {project.cityName && (
            <div className="project-city">
              <span className="meta-label">{t('projects.city')}:</span>
              <span className="meta-value">{isRTL ? project.cityName : project.cityNameEn}</span>
            </div>
          )}
        </div>
      </div>

      {/* جسم البطاقة */}
      <div className="project-body">
        {/* إحصائيات المشروع */}
        <div className="project-stats">
          <div className="project-stat">
            <div className="project-stat-value">{project.countOfUnits || 0}</div>
            <div className="project-stat-label">{t('projects.units')}</div>
          </div>
          <div className="project-stat">
            <div className="project-stat-value">{project.favoritedUsersCount || 0}</div>
            <div className="project-stat-label">{t('projects.favorites')}</div>
          </div>
          <div className="project-stat">
            <div className="project-stat-value">{project.interestedUsersCount || 0}</div>
            <div className="project-stat-label">{t('projects.interested')}</div>
          </div>
          <div className="project-stat">
            <div className="project-stat-value">{project.assignedEmployeeNames?.length || 0}</div>
            <div className="project-stat-label">{t('projects.employees')}</div>
          </div>
        </div>

        {/* الموظفين المسندين */}
        {project.assignedEmployeeNames && project.assignedEmployeeNames.length > 0 && (
          <div className="project-employees">
            <div className="project-employees-title">{t('projects.employees')}:</div>
            <div className="employees-list">
              {project.assignedEmployeeNames.slice(0, 3).map((name, index) => (
                <span key={index} className="employee-tag">{name}</span>
              ))}
              {project.assignedEmployeeNames.length > 3 && (
                <span className="employee-tag">+{project.assignedEmployeeNames.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* الملاحظات */}
        {project.notes && project.notes.length > 0 && (
          <div className="project-notes">
            <div className="project-notes-title">{t('projects.notes')}:</div>
            <div className="project-notes-content">
              {project.notes[0].content?.substring(0, 100)}
              {project.notes[0].content && project.notes[0].content.length > 100 && '...'}
            </div>
          </div>
        )}

        {/* أزرار العمليات */}
        <div className="project-actions">
          {isAdmin && (
            <>
              <button 
                className={`action-btn ${project.isActive ? 'action-btn-success' : 'action-btn-secondary'}`}
                onClick={onToggleStatus}
                title={project.isActive ? t('projects.deactivate') : t('projects.activate')}
              >
                {project.isActive ? (
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                  </svg>
                )}
                {project.isActive ? t('dashboard.inactive') : t('dashboard.active')}
              </button>
              
              <button 
                className={`action-btn ${project.isFeatured ? 'action-btn-info' : 'action-btn-secondary'}`}
                onClick={onToggleFeatured}
                title={project.isFeatured ? t('projects.removeFeatured') : t('projects.addFeatured')}
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386-.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                {project.isFeatured ? t('projects.removeFeatured') : t('projects.addFeatured')}
              </button>
              
              <button className="action-btn action-btn-primary">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9l-3-3L2.5 11.707V12.5a.5.5 0 0 0 .5.5h.793L11.207 9z"/>
                </svg>
                {t('projects.edit')}
              </button>
              
              <button 
                className="action-btn action-btn-danger"
                onClick={onDelete}
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                </svg>
                {t('projects.delete')}
              </button>
            </>
          )}

          <button className="action-btn action-btn-info">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            {t('projects.details')}
          </button>

          {/* أزرار عرض المهتمين والمفضلة */}
          {(project.interestedUsersCount || 0) > 0 && (
            <button className="action-btn action-btn-secondary">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
              </svg>
              {t('projects.viewInterested')} ({project.interestedUsersCount})
            </button>
          )}

          {(project.favoritedUsersCount || 0) > 0 && (
            <button className="action-btn action-btn-secondary">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
              </svg>
              {t('projects.viewFavorites')} ({project.favoritedUsersCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
