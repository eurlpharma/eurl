import { createContext, useState, useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { loginSuccess, logout } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import axios from '@/api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  // Check if token exists and is valid on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Validate token expiration
        const decoded = jwtDecode<JwtPayload>(token);
        
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }

        // Set auth token header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token with server and get fresh user data
        try {
          const response = await axios.get('/api/users/profile');
          
          if (response.data && response.data.user) {
            // Use server data if available
            const userData: User = response.data.user;

            setUser(userData);
            setIsAuthenticated(true);
            dispatch(loginSuccess({ user: userData, token }));
          } else {
            // Fallback to token data if API request fails
            const userData: User = {
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              role: decoded.role,
            };
            
            setUser(userData);
            setIsAuthenticated(true);
            dispatch(loginSuccess({ user: userData, token }));
          }
        } catch (apiError) {
          
          // Fallback to token data if API request fails
          const userData: User = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
          };
          

          setUser(userData);
          setIsAuthenticated(true);
          dispatch(loginSuccess({ user: userData, token }));
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [dispatch]);

  // Listen for storage changes (when token is set by Redux)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && e.newValue) {
        const token = e.newValue;
        loginUser(token);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for custom events (for same-tab updates)
  useEffect(() => {
    const handleTokenUpdate = (e: CustomEvent) => {
      if (e.detail && e.detail.token) {
        loginUser(e.detail.token);
      }
    };

    window.addEventListener('tokenUpdated', handleTokenUpdate as EventListener);
    return () => window.removeEventListener('tokenUpdated', handleTokenUpdate as EventListener);
  }, []);

  const loginUser = async (token: string) => {
    try {
      localStorage.setItem('token', token);
      
      // Set auth token header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Decode token to get user data
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Try to get fresh user data from API
      try {
        const response = await axios.get('/api/users/profile');

        
        if (response.data && response.data.user) {
          // Use server data if available
          const userData: User = response.data.user;

          setUser(userData);
          setIsAuthenticated(true);
          dispatch(loginSuccess({ user: userData, token }));
          return;
        }
      } catch (apiError) {
      }
      
      // Fallback to token data
      const userData: User = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };

      
      setUser(userData);
      setIsAuthenticated(true);
      dispatch(loginSuccess({ user: userData, token }));
    } catch (error) {
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    dispatch(logout());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login: loginUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
