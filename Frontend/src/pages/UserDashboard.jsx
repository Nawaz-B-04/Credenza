import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../auth/AuthContext';

const Star = ({ filled, onClick, interactive = true, size = 'text-2xl' }) => (
  <span
    onClick={onClick}
    className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${size} ${
      filled ? 'text-yellow-400' : 'text-gray-300'
    }`}
  >
    ★
  </span>
);

const StoreCard = ({ store, onRate }) => {
  const [userRating, setUserRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (rating) => {
    if (rating === 0) return;

    setIsSubmitting(true);
    setUserRating(rating);
    await onRate(store.id, rating);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-xl text-gray-800 mb-1">{store.name}</h3>
          <p className="text-gray-600 mb-3 flex items-center">
            <span className="mr-2">📍</span>
            {store.address}
          </p>
        </div>
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
          #{store.id}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                filled={store.avgRating >= star}
                onClick={null}
                interactive={false}
                size="text-lg"
              />
            ))}
          </div>
          <span className="text-lg font-bold text-gray-800">
            {store.avgRating?.toFixed(1) || '0.0'}
          </span>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {store.totalRatings || 0} ratings
        </span>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-3">
          {userRating ? 'Your Rating:' : 'Rate this store:'}
        </p>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex space-x-1" onMouseLeave={() => setTempRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setUserRating(star)}
                onMouseEnter={() => setTempRating(star)}
                className={`cursor-pointer text-2xl transition-transform ${
                  star <= (tempRating || userRating)
                    ? 'text-yellow-400 scale-110'
                    : 'text-gray-300'
                } ${isSubmitting ? 'opacity-50' : 'hover:scale-110'}`}
              >
                ★
              </span>
            ))}
          </div>
          {userRating > 0 && (
            <span className="text-sm text-gray-600">
              ({userRating} {userRating === 1 ? 'star' : 'stars'})
            </span>
          )}
        </div>

        <button
          onClick={() => handleRate(userRating)}
          disabled={isSubmitting || userRating === 0}
          className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
            isSubmitting || userRating === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </span>
          ) : (
            'Submit Rating'
          )}
        </button>

        {userRating > 0 && (
          <button
            onClick={() => {
              setUserRating(0);
              setTempRating(0);
            }}
            className="w-full mt-2 text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Clear Rating
          </button>
        )}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [stores, setStores] = useState([]);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchStores = async () => {
    try {
      const res = await API.get('/users/stores');
      setStores(res.data);
    } catch (err) {
      alert('Failed to load stores: ' + (err.response?.data?.message || err.message));
    }
  };

  const rateStore = async (storeId, rating) => {
    try {
      await API.post('/rate', { storeId, rating });
      fetchStores();
    } catch (err) {
      alert(err?.response?.data?.message || 'Rating failed');
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      return 'Must contain at least one special character';
    return '';
  };

  const updatePassword = async () => {
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    setIsUpdating(true);
    try {
      await API.put('/update-password', { newPassword: password });
      alert('Password updated successfully');
      setPassword('');
      setPasswordError('');
      setShowPasswordModal(false);
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navbar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
            <p className="text-gray-500">🛍️ Discover and rate your favorite stores</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
            >
              🔒 Update Password
            </button>
            {/* <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              🚪 Sign Out
            </button> */}
          </div>
        </div>

        {/* Stores */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Stores</h2>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
              {filteredStores.length} stores
            </span>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} onRate={rateStore} />
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No matching stores</h3>
              <p className="text-gray-500">Try searching with another name or address.</p>
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Password</h2>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                passwordError ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={updatePassword}
                disabled={isUpdating || !password}
                className={`px-4 py-2 rounded-lg text-white ${
                  isUpdating || !password
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
