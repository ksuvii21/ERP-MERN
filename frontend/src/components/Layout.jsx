import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { logout, reset } from '../redux/slices/authSlice';
import { getNavItems } from '../config/moduleConfig';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  useEffect(() => {
    // Check if user data is stale (company is an ID string instead of an object)
    // This happens if the user logged in before the backend update.
    if (user && user.company && typeof user.company === 'string') {
      console.warn('User data is stale. Logging out to refresh permissions.');
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch, navigate]);

  // Generate dynamic navigation based on Industry and Role
  const industry = user?.company?.industryType;
  const groupedNavItems = getNavItems(industry, user?.role);

  // Debugging: See exactly what the system detects
  console.log('Layout Debug:', { 
    industry, 
    role: user?.role, 
    companyType: typeof user?.company 
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <span className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>ERP System</span>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {Object.values(groupedNavItems).flat().map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    location.pathname.startsWith(item.path)
                      ? 'bg-teal-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={isSidebarOpen ? '' : item.name}
                >
                  <item.icon size={20} />
                  <span className={`${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
                </Link>
              </li>
            ))}
          
            {/* Admin Section */}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <li>
                <Link 
                  to="/app/admin/system-logs"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    location.pathname.startsWith('/app/admin/system-logs')
                      ? 'bg-teal-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={isSidebarOpen ? '' : 'System Logs'}
                >
                  <ShieldCheck size={20} />
                  <span className={`${!isSidebarOpen && 'hidden'}`}>System Logs</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-white w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut size={20} />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {Object.values(groupedNavItems).flat().find(i => location.pathname.startsWith(i.path))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
          <div className="text-right border-r pr-4 border-gray-200 hidden sm:block">
            <p className="text-sm font-bold text-teal-700 leading-tight">{user?.company?.name || 'Organization'}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{user?.company?.industryType || 'General'}</p>
          </div>
          <span className="text-sm text-gray-600 font-medium">Welcome, {user?.name || 'User'}</span>
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* This Outlet is where the nested routes render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;