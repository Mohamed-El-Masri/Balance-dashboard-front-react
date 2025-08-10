import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const demoAccounts = [
    { role: 'Superadmin', email: 'admin@balance.com', password: 'password' },
    { role: 'Admin', email: 'manager@balance.com', password: 'password' },
    { role: 'Employee', email: 'employee@balance.com', password: 'password' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (authError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by the auth context/App component
    } catch (error) {
      // Error is already handled by the auth hook and will be shown via authError
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    setFormData({ email, password });
    setIsLoading(true);
    setErrors({});
    
    try {
      await login(email, password);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">B</div>
          <h1 className="login-title">{t('common.balance')}</h1>
          <p className="login-subtitle">{t('navigation.realEstate')}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('auth.emailAddress')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder={t('auth.enterEmail')}
              disabled={isLoading}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('common.password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder={t('auth.enterPassword')}
              disabled={isLoading}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-options">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="checkbox-label">
                {t('auth.rememberMe')}
              </label>
            </div>
            <a href="#" className="forgot-password">
              {t('auth.forgotPassword')}
            </a>
          </div>

          {(authError || errors.submit) && (
            <div className="error-message" style={{ marginBottom: 'var(--spacing-lg)' }}>
              {authError || errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                {t('common.loading')}
              </>
            ) : (
              t('auth.signIn')
            )}
          </button>

        
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
