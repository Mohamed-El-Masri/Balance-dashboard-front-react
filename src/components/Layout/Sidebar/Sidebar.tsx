import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Building2, 
  CheckSquare, 
  Users, 
  MessageSquare, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole } from '../../../types';
import './Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse, 
  isMobileOpen, 
  onMobileClose 
}) => {
  const { t, i18n } = useTranslation();
  const { hasPermission } = useAuth();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const navigationItems = [
    {
      section: 'main',
      items: [
        {
          label: t('common.dashboard'),
          path: '/dashboard',
          icon: LayoutDashboard,
          roles: ['superadmin', 'admin', 'employee'] as UserRole[]
        },
        {
          label: t('common.projects'),
          path: '/projects',
          icon: Building2,
          roles: ['superadmin', 'admin', 'employee'] as UserRole[]
        },
        {
          label: t('common.units'),
          path: '/units',
          icon: FileText,
          roles: ['superadmin', 'admin', 'employee'] as UserRole[]
        },
        {
          label: t('common.tasks'),
          path: '/tasks',
          icon: CheckSquare,
          roles: ['superadmin', 'admin', 'employee'] as UserRole[],
          badge: 5 // Mock badge count
        }
      ]
    },
    {
      section: 'admin',
      items: [
        {
          label: t('common.users'),
          path: '/users',
          icon: Users,
          roles: ['superadmin'] as UserRole[]
        },
        {
          label: t('common.messages'),
          path: '/messages',
          icon: MessageSquare,
          roles: ['superadmin', 'admin'] as UserRole[]
        },
        {
          label: t('common.requests'),
          path: '/requests',
          icon: FileText,
          roles: ['superadmin', 'admin'] as UserRole[]
        }
      ]
    },
    {
      section: 'system',
      items: [
        {
          label: t('common.settings'),
          path: '/settings',
          icon: Settings,
          roles: ['superadmin', 'admin'] as UserRole[]
        }
      ]
    }
  ];

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onMobileClose();
    }
  };

  const sidebarClasses = [
    'sidebar',
    isCollapsed ? 'sidebar-collapsed' : '',
    isMobileOpen ? 'mobile-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'show' : ''}`}
        onClick={onMobileClose}
      />
      
      <aside className={sidebarClasses}>
        {/* Collapse Toggle Button */}
        <button 
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          title={isCollapsed ? t('common.expand') : t('common.collapse')}
        >
          {isRTL ? (
            isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />
          ) : (
            isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />
          )}
        </button>

        <nav className="sidebar-nav">
          {navigationItems.map((section) => (
            <div key={section.section} className="nav-section">
              <h3 className="nav-section-title">
                {t(`navigation.${section.section}`)}
              </h3>
              <ul className="nav-list">
                {section.items
                  .filter(item => hasPermission(item.roles))
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <li key={item.path} className="nav-item">
                        <NavLink
                          to={item.path}
                          className={`nav-link ${isActive ? 'active' : ''}`}
                          onClick={handleLinkClick}
                        >
                          <Icon className="nav-icon" size={20} />
                          <span className="nav-text">{item.label}</span>
                          {item.badge && (
                            <span className="nav-badge">{item.badge}</span>
                          )}
                          {isCollapsed && (
                            <div className="nav-tooltip">
                              {item.label}
                            </div>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
