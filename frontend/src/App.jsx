import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Students from './screens/Students';
import StudentDetail from './screens/StudentDetail';
import MyGrades from './screens/MyGrades';
import Navbar from './components/Navbar';

function ProtectedRoute({ children, allowRoles }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (allowRoles && !allowRoles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute allowRoles={['admin', 'enseignant']}>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute allowRoles={['admin', 'enseignant']}>
              <Layout><Students /></Layout>
            </ProtectedRoute>
          } />

          {/* FIX 8: /students/:id restricted to staff — etudiant role is blocked here too.
              The backend IDOR fix is the real guard; this closes the frontend door as well. */}
          <Route path="/students/:id" element={
            <ProtectedRoute allowRoles={['admin', 'enseignant']}>
              <Layout><StudentDetail /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/my-grades" element={
            <ProtectedRoute allowRoles={['etudiant']}>
              <Layout><MyGrades /></Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function RoleRedirect() {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === 'etudiant' ? '/my-grades' : '/'} replace />;
}
