import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  useEffect(() => {
    if (refreshToken) {
      setIsAuthenticated(true);
    }
  }, [refreshToken]);

  const login = async (credentials) => {
    try {
      const response = await loginService(credentials);
      if (response.httpStatus === 'OK') {
        setRefreshToken(response.data.refreshToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setRefreshToken(null);
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    refreshToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 