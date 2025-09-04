import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
import PermissionsPage from './pages/PermissionsPage';

// PUBLIC_INTERFACE
function ProtectedRoute({ children }) {
  /** Protects routes from unauthenticated access. Redirects to /login. */
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <div className="brand">
        <span className="dot" />
        RBAC Admin
      </div>
      <div className="header-actions">
        <span className="chip">Signed in as {user?.email}</span>
        <button className="btn secondary" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

function Sidebar() {
  const linkClass = ({ isActive }) => 'nav-item' + (isActive ? ' active' : '');
  return (
    <aside className="sidebar">
      <div className="nav-group">
        <div className="nav-title">Overview</div>
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
      </div>
      <div className="nav-group">
        <div className="nav-title">Manage</div>
        <NavLink to="/users" className={linkClass}>Users</NavLink>
        <NavLink to="/roles" className={linkClass}>Roles</NavLink>
        <NavLink to="/permissions" className={linkClass}>Permissions</NavLink>
      </div>
    </aside>
  );
}

function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root app with router and auth provider */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
