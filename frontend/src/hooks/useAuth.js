import { useState, useEffect } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext.jsx';

// Additional auth-related utilities
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on component mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (err) {
      setError('Failed to check authentication status');
      console.error('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would typically call your API
      // For now, we'll simulate an API call
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const data = await response.json();
      
      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error('Password change failed');
      }

      return await response.json();
    } catch (err) {
      setError(err.message || 'Password change failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    return user.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user,
  };
};

// Hook for protecting routes based on authentication
export const useRequireAuth = (redirectUrl = '/login') => {
  const { user, loading } = useAuthContext();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShouldRedirect(true);
      // You can also implement actual redirect logic here
      // using useNavigate from react-router-dom
    }
  }, [user, loading, redirectUrl]);

  return {
    shouldRedirect,
    isAuthenticated: !!user,
    loading,
  };
};

// Hook for protecting routes based on roles
export const useRequireRole = (requiredRole, redirectUrl = '/') => {
  const { user, loading } = useAuthContext();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== requiredRole) {
        setShouldRedirect(true);
      }
    }
  }, [user, loading, requiredRole, redirectUrl]);

  return {
    shouldRedirect,
    hasRequiredRole: user?.role === requiredRole,
    loading,
  };
};

// Hook for protecting routes based on multiple roles
export const useRequireAnyRole = (requiredRoles, redirectUrl = '/') => {
  const { user, loading } = useAuthContext();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (!requiredRoles.includes(user.role)) {
        setShouldRedirect(true);
      }
    }
  }, [user, loading, requiredRoles, redirectUrl]);

  return {
    shouldRedirect,
    hasRequiredRole: requiredRoles.includes(user?.role),
    loading,
  };
};