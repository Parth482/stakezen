import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/admin/login" replace />;

  try {
    const decoded = jwtDecode(token); 
    if (decoded.role !== 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
  } catch (err) {
    console.error('Invalid token', err);
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
