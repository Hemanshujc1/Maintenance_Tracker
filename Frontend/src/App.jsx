import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Unauthorized from './components/Unauthorized';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import EquipmentList from './pages/EquipmentList';
import EquipmentForm from './pages/EquipmentForm';
import './App.css';

// Public Route wrapper to redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes Wrapped in DashboardLayout */}
          <Route element={<DashboardLayout />}>
              {/* Admin/Manager Dashboard */}
              <Route element={<ProtectedRoute roles={['Admin', 'Manager']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* Equipment Routes - Accessible to Admin, Manager, Technician */}
              <Route element={<ProtectedRoute roles={['Admin', 'Manager', 'Technician', 'Employee']} />}>
                 <Route path="/equipment" element={<EquipmentList />} />
                 <Route path="/equipment/new" element={<EquipmentForm />} />
                 <Route path="/equipment/:id" element={<EquipmentForm />} />
              </Route>
          </Route>

          {/* Redirect root to login (or dashboard if auth handled by PublicRoute logic/ProtectedRoute) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
