import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) {
      setAuth({ user, token });
    }
    setLoading(false); 
  }, []);

  const login = async ({ email, password, isStore }) => {
    try {
      const url = isStore ? '/store/store-login' : '/login';
      const res = await API.post(url, { email, password });

      const data = isStore ? res.data.store : res.data.user;
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', res.data.token);
      setAuth({ user: data, token: res.data.token });

      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'user') navigate('/user');
      else if (data.role === 'store') navigate('/store');
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ user: null, token: null });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
