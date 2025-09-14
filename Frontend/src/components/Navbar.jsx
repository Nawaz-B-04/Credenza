
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-2 group">
        <div className="bg-white p-2 rounded-lg transform group-hover:rotate-12 transition-transform">
          <span className="text-2xl">🏪</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Credenza</h1>
          <p className="text-xs text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity">
            Discover • Rate • Share
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-6">
        {!auth.token ? (
          <>
            <Link 
              to="/" 
              className="text-purple-100 hover:text-white transition-colors hidden md:block"
            >
              Home
            </Link>
            
       
           { /* Auth Actions */}
            <div className="flex items-center gap-3">
              {!isLoginPage && (
                <Link 
                  to="/login" 
                  className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-md hover:shadow-lg"
                >
                  Sign In
                </Link>
              )}
              
              {!isRegisterPage && (
                <Link 
                  to="/register" 
                  className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition-all"
                >
                  Join Now
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <Link 
              to="/" 
              className="text-purple-100 hover:text-white transition-colors"
            >
              Home
            </Link>
            
            {auth.user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-purple-100 hover:text-white transition-colors hidden md:block"
              >
                Admin Panel
              </Link>
            )}
            
            {auth.user?.role === 'store' && (
              <Link 
                to="/my-store" 
                className="text-purple-100 hover:text-white transition-colors hidden md:block"
              >
                My Store
              </Link>
            )}

       
            <div className="flex items-center gap-3 ml-2">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-bold text-sm">
                    {auth.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">
                    {auth.user?.name}
                  </p>
                  <p className="text-purple-200 text-xs capitalize">
                    {auth.user?.role}
                  </p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="text-purple-200 hover:text-white transition-colors text-sm flex items-center gap-1 bg-purple-600 px-3 py-2 rounded-lg hover:bg-purple-500"
              >
                <span className="hidden md:inline">Sign Out</span>
                <span>🚪</span>
              </button>
              
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
