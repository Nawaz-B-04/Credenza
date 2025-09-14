import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../auth/AuthContext';

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
    />
  </div>
);

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  // Sorting states
  const [storeSort, setStoreSort] = useState({ field: 'name', order: 'asc' });
  const [userSort, setUserSort] = useState({ field: 'name', order: 'asc' });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });
  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  /* --- Fetch helpers --- */
  const fetchStats = async () => {
    const res = await API.get('/admin/stats');
    setStats({
      users: res.data.totalUsers,
      stores: res.data.totalStores,
      ratings: res.data.totalRatings,
    });
  };

  const fetchStores = async () => {
    const res = await API.get('/admin/stores');
    setStores(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get('/admin/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchStats();
    fetchStores();
    fetchUsers();
  }, []);

  /* --- Create User/Admin --- */
  const createUser = async () => {
    try {
      await API.post('/admin/create-user', userForm);
      alert('User/Admin created successfully');
      setUserForm({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert(err?.response?.data?.message || 'Creation failed');
    }
  };

  /* --- Create Store --- */
  const createStore = async () => {
    try {
      await API.post('/admin/create-store', storeForm);
      alert('Store created successfully');
      setStoreForm({ name: '', email: '', password: '', address: '' });
      fetchStores();
      fetchStats();
    } catch (err) {
      alert(err?.response?.data?.message || 'Creation failed');
    }
  };

  /* --- Filtering --- */
  const filteredStores = stores.filter((s) =>
    [s.name, s.email, s.address].some((f) => f.toLowerCase().includes(filter.toLowerCase()))
  );

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.address, u.role].some((f) =>
      f?.toLowerCase().includes(filter.toLowerCase())
    )
  );

  /* --- Sorting Helpers --- */
  const sortData = (data, sortConfig) => {
    const { field, order } = sortConfig;
    return [...data].sort((a, b) => {
      let valA = a[field] ?? '';
      let valB = b[field] ?? '';

      // if number (like rating), compare numerically
      if (typeof valA === 'number' && typeof valB === 'number') {
        return order === 'asc' ? valA - valB : valB - valA;
      }

      // fallback: compare as string
      return order === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  };

  const sortedStores = sortData(filteredStores, storeSort);
  const sortedUsers = sortData(filteredUsers, userSort);

  const toggleSort = (type, field) => {
    if (type === 'store') {
      setStoreSort((prev) => ({
        field,
        order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
      }));
    } else {
      setUserSort((prev) => ({
        field,
        order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
      }));
    }
  };

  const SortIcon = ({ active, order }) => {
    if (!active) return <span className="ml-1 text-gray-400">↕</span>;
    return order === 'asc' ? (
      <span className="ml-1">▲</span>
    ) : (
      <span className="ml-1">▼</span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Results</h3>
          <input
            type="text"
            placeholder="Search by name, email, address, or role..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Stores Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">📊</span> Stores ({sortedStores.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['name', 'email', 'address', 'averageRating'].map((field) => (
                    <th
                      key={field}
                      onClick={() => toggleSort('store', field)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      {field === 'averageRating' ? 'Rating' : field.charAt(0).toUpperCase() + field.slice(1)}
                      <SortIcon
                        active={storeSort.field === field}
                        order={storeSort.order}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedStores.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 text-gray-600">{s.email}</td>
                    <td className="px-6 py-4 text-gray-600">{s.address}</td>
                    <td className="px-6 py-4">{s.averageRating?.toFixed(1) || 'N/A'} ⭐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">👥</span> Users & Admins ({sortedUsers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['name', 'email', 'address', 'role'].map((field) => (
                    <th
                      key={field}
                      onClick={() => toggleSort('user', field)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      <SortIcon
                        active={userSort.field === field}
                        order={userSort.order}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600">{u.address}</td>
                    <td className="px-6 py-4 capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
