import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, ChevronDown, Globe, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationsDropdown from '../../Notifications/NotificationsDropdown';
import './Header.css';

interface HeaderProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  breadcrumbs = []
}) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    setShowLanguageMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'ar' ? 'العربية' : 'English';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="header">
      <div className="header-left">
        <a href="/" className="logo">
          <div className="logo-icon">B</div>
          <div className="logo-text">
            <h1 className="logo-title">{t('common.balance')}</h1>
            <p className="logo-subtitle">{t('navigation.realEstate')}</p>
          </div>
        </a>
        
        {(title || breadcrumbs.length > 0) && (
          <nav className="breadcrumb">
            <span>{t('navigation.overview')}</span>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className="breadcrumb-separator">/</span>
                {crumb.href ? (
                  <a href={crumb.href}>{crumb.label}</a>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
            {title && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span>{title}</span>
              </>
            )}
          </nav>
        )}
      </div>

      <div className="header-right">
        {/* Language Switcher */}
        <div className="language-switcher" ref={languageMenuRef}>
          <button
            className="language-button"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <Globe size={16} />
            <span>{getCurrentLanguageLabel()}</span>
            <ChevronDown size={14} />
          </button>
          
          {showLanguageMenu && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => handleLanguageChange('en')}
              >
                English
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleLanguageChange('ar')}
              >
                العربية
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationsDropdown
          onNotificationClick={(notification) => {
            // Handle notification navigation based on type and data
            if (notification.data?.projectId) {
              // Navigate to project details
              window.location.href = `/projects/${notification.data.projectId}`;
            }
          }}
        />

        {/* User Menu */}
        <div className="user-menu" ref={userMenuRef}>
            <button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            >
            <div className="user-avatar">
              {getInitials(user?.name || 'User')}
            </div>
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{t(`users.${user?.role}`)}</p>
            </div>
            <ChevronDown size={16} />
            </button>

          {showUserMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <User size={16} />
                {t('common.profile')}
              </button>
              <button className="dropdown-item">
                <Settings size={16} />
                {t('common.settings')}
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleLogout}>
                <LogOut size={16} />
                {t('auth.signOut')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
