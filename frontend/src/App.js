import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import AdminNav from './components/AdminNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Journal from './pages/Journal';
import Community from './pages/Community';
import Progress from './pages/Progress';
import CopingStrategies from './pages/CopingStrategies';
import UserProfile from './pages/UserProfile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import ResourceList from './components/admin/ResourceList';
import ResourceForm from './components/admin/ResourceForm';
import UserManagement from './components/admin/UserManagement';
import SystemSettings from './components/admin/SystemSettings';
import OCR from './components/OCR';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/signup', '/admin/login', '/admin/signup'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin/');

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <div className="app">
          {!isAuthPage && !isAdminPage && <Navbar />}
          {isAdminPage && !isAuthPage && <AdminNav />}
          <main className={`main-content ${isAuthPage ? 'auth-page' : ''}`}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/assessment" element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="/resources/:id" element={
                <ProtectedRoute>
                  <ResourceDetail />
                </ProtectedRoute>
              } />
              <Route path="/journal" element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/coping-strategies" element={
                <ProtectedRoute>
                  <CopingStrategies />
                </ProtectedRoute>
              } />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SystemSettings />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/resources" element={<ProtectedRoute allowedRoles={['admin']}><ResourceList /></ProtectedRoute>} />
              <Route path="/admin/resources/create" element={<ProtectedRoute allowedRoles={['admin']}><ResourceForm /></ProtectedRoute>} />
              <Route path="/admin/resources/edit/:id" element={<ProtectedRoute allowedRoles={['admin']}><ResourceForm /></ProtectedRoute>} />
              <Route path="/ocr" element={
                <ProtectedRoute>
                  <OCR />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          {!isAuthPage && !isAdminPage && <Footer />}
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
