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

          {/* Staff routes */}
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

          {/*
            VULNERABILITY 4: IDOR — hidden page accessible by direct URL
            The /students/:id route is meant for teachers only.
            Student role users have NO nav link or button pointing here.
            But there is ZERO backend ownership check:
              GET /api/grades/student/:studentId returns data for ANY id.
            A logged-in student who finds another student's _id (trivial via
            GET /api/students which needs no auth) can navigate directly to:
              http://localhost:5173/students/<victim_id>
            and see their full grade sheet.
          */}
          <Route path="/students/:id" element={
            <ProtectedRoute>
              <Layout><StudentDetail /></Layout>
            </ProtectedRoute>
          } />

          {/* Student-only route */}
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
