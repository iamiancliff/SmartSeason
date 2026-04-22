import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';

import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LandingPage } from './pages/LandingPage';

import { AdminDashboard } from './pages/AdminDashboard';
import { AgentDashboard } from './pages/AgentDashboard';
import { AgentHistory } from './pages/AgentHistory';
import { AgentProfile } from './pages/AgentProfile';
import { AdminDirectory } from './pages/AdminDirectory';
import { AdminAgents } from './pages/AdminAgents';

// Smart Redirect as requested in the requirements
const DashboardRedirect = () => {
  const { user } = useAuthStore();
  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user?.role === 'AGENT') return <Navigate to="/agent" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<AppLayout />}>

          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/directory" 
            element={<ProtectedRoute role="ADMIN"><AdminDirectory /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/agents" 
            element={<ProtectedRoute role="ADMIN"><AdminAgents /></ProtectedRoute>} 
          />

          {/* Agent Explicit Route */}
          <Route 
            path="/agent" 
            element={
              <ProtectedRoute role="AGENT">
                <AgentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/history" 
            element={
              <ProtectedRoute role="AGENT"><AgentHistory /></ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/profile" 
            element={
              <ProtectedRoute role="AGENT"><AgentProfile /></ProtectedRoute>
            } 
          />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
