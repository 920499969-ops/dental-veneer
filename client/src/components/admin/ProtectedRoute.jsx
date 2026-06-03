import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminMe } from '../../utils/api';

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState({ loading: true, ok: false });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setAuth({ loading: false, ok: false });
      return;
    }
    getAdminMe()
      .then(() => setAuth({ loading: false, ok: true }))
      .catch(() => {
        localStorage.removeItem('admin_token');
        setAuth({ loading: false, ok: false });
      });
  }, []);

  if (auth.loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-cream">
        <div className="flex items-center gap-3 text-brown-light">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          验证登录状态...
        </div>
      </div>
    );
  }

  if (!auth.ok) return <Navigate to="/admin/login" replace />;
  return children;
}
