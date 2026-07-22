import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('drivehub_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Failed to load current user:", err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchCurrentUser();
  }, [token]);

  const login = async (username_or_email, password) => {
    const res = await authAPI.login({ username_or_email, password });
    const { access_token, user: loggedUser } = res.data;
    localStorage.setItem('drivehub_token', access_token);
    setToken(access_token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (username, email, password, role = 'customer') => {
    const res = await authAPI.register({ username, email, password, role });
    // Auto login after registration
    return login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('drivehub_token');
    setToken(null);
    setUser(null);
  };

  const loginDemoAdmin = () => login('admin', 'admin123');
  const loginDemoCustomer = () => login('customer', 'customer123');

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        loginDemoAdmin,
        loginDemoCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
