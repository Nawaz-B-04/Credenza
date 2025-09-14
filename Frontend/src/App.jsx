import { useAuth } from './auth/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import StoreDashboard from './pages/StoreDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, role }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>; 

  if (!auth.token) return <Navigate to="/login" />;
  if (role && auth.user.role !== role) return <Navigate to="/login" />;

  return children;
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute role="store">
              <StoreDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
