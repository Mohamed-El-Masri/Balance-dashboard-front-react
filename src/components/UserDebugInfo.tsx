import React from 'react';
import { useAuth } from '../hooks/useAuth';

const UserDebugInfo: React.FC = () => {
  const { user, isAuthenticated, refreshAuth } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Debug Info:</h4>
      <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      {user && (
        <div>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Department:</strong> {user.department}</p>
          <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
          <p><strong>Last Login:</strong> {user.lastLoginAt}</p>
          {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
          {user.location && <p><strong>Location:</strong> {user.location}</p>}
          {user.roleNames && <p><strong>Roles:</strong> {user.roleNames.join(', ')}</p>}
          {user.avatar && (
            <div>
              <strong>Avatar:</strong>
              <img src={user.avatar} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '5px' }} />
            </div>
          )}
        </div>
      )}
      <button onClick={refreshAuth} style={{ marginTop: '5px', fontSize: '10px' }}>
        Refresh
      </button>
    </div>
  );
};

export default UserDebugInfo;
