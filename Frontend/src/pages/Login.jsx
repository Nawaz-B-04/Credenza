import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import API from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('user'); 
  const [form, setForm] = useState({
    email: '',
    password: '',
    isStore: false
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Validate in real-time
    let error = '';
    if (field === 'email') {
      error = validateEmail(value);
    } else if (field === 'password') {
      error = validatePassword(value);
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password)
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the form errors before submitting');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      let endpoint, payload;

      if (activeTab === 'admin') {
        endpoint = '/login';
        payload = { email: form.email, password: form.password };
      } else {
        endpoint = form.isStore ? '/store/store-login' : '/login';
        payload = { email: form.email, password: form.password };
      }

      const res = await API.post(endpoint, payload);
      const userData = form.isStore ? res.data.store : res.data.user;
      const token = res.data.token;

      login({
        email: form.email,
        password: form.password,
        isStore: form.isStore
      });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = () => {
    return Object.values(errors).some(error => error !== '') || 
           !form.email || !form.password || loading;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 font-medium ${activeTab === 'user' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('user')}
          >
            User Login
          </button>
          <button
            className={`flex-1 py-4 font-medium ${activeTab === 'admin' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {activeTab === 'user' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isStore"
                checked={form.isStore}
                onChange={(e) => setForm({...form, isStore: e.target.checked})}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isStore" className="ml-2 block text-sm text-gray-700">
                I am a store owner
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled()}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitDisabled() 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              `Login as ${activeTab === 'admin' ? 'Admin' : form.isStore ? 'Store' : 'User'}`
            )}
          </button>
        </form>
      </div>
    </div>

  );
};

export default Login;