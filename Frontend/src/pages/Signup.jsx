import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const validateName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 20) {
      return 'Name must be at least 20 characters long';
    }
    if (trimmedName.length > 60) {
      return 'Name cannot exceed 60 characters';
    }
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateAddress = (address) => {
    if (address && address.length > 400) {
      return 'Address cannot exceed 400 characters';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
      return 'Password must be between 8-16 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    let error = '';
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await API.post('/register', { 
        ...form, 
        name: form.name.trim(),
        address: form.address.trim()
      });
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = () => {
    return Object.values(errors).some(error => error !== '') || 
           !form.name || !form.email || !form.password || loading;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
        {/* Header with branding */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Join ShopScore</h1>
          <p className="text-purple-200">Rate, Review, Discover</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-2">👤</span>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                errors.name 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 focus:border-purple-500'
              }`}
              placeholder="Enter your full name"
              required
            />
            {errors.name ? (
              <p className="text-red-500 text-sm flex items-center">
                <span className="mr-1">❌</span>
                {errors.name}
              </p>
            ) : (
              <p className="text-gray-500 text-xs">
                Must be 20-60 characters. Current: {form.name.trim().length}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-2">📧</span>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                errors.email 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 focus:border-purple-500'
              }`}
              placeholder="your.email@example.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="mr-1">❌</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-2">📍</span>
              Address (Optional)
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                errors.address 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 focus:border-purple-500'
              }`}
              placeholder="Enter your address"
            />
            {errors.address ? (
              <p className="text-red-500 text-sm flex items-center">
                <span className="mr-1">❌</span>
                {errors.address}
              </p>
            ) : (
              <p className="text-gray-500 text-xs">
                Maximum 400 characters. Current: {form.address.length}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-2">🔒</span>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                errors.password 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 focus:border-purple-500'
              }`}
              placeholder="Create a secure password"
              required
            />
            {errors.password ? (
              <p className="text-red-500 text-sm flex items-center">
                <span className="mr-1">❌</span>
                {errors.password}
              </p>
            ) : (
              <p className="text-gray-500 text-xs">
                8-16 characters with at least one uppercase letter and one special character
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled()}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              isSubmitDisabled() 
                ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-2xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                🚀 Create Account
                <span className="ml-2">→</span>
              </span>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                Sign in here
              </a>
            </p>
          </div>
        </form>

        {/* Decorative Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <div className="flex justify-center space-x-4 mb-2">
            {['⭐', '🛒', '🏪', '💰', '🎯'].map((emoji, index) => (
              <span key={index} className="text-xl opacity-60 hover:opacity-100 transition-opacity">
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">Join our community of store enthusiasts!</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;