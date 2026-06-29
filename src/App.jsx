import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import './index.css';

import Layout from './components/layouts/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import PrivateRoute from './components/ui/PrivateRoute';

const NotFound = lazy(() => import('./pages/404notfound'));
const Home = lazy(() => import('./pages/home'));
const FAQ = lazy(() => import('./pages/faq'));
const AdminPanel = lazy(() => import('./pages/adminPanel'));
const Login = lazy(() => import('./pages/login'));
const Terms = lazy(() => import('./pages/terms'));
const Privacy = lazy(() => import('./pages/privacy'));

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = setTimeout(() => setLoading(false), 2400);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={null}>
        <Routes>
          {/* Redirect root to /es */}
          <Route path="/" element={<Navigate to={navigator.language?.startsWith('en') ? '/en' : '/es'} replace />} />

          {/* Routes with language prefix */}
          <Route path="/:lang" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
          </Route>

          {/* Admin routes (no lang prefix) */}
          <Route
            path="/adminpanel"
            element={
              <PrivateRoute roles={['admin', 'Administrador']}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login onClose={() => {}} />} />
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>

        {/* Loading overlay — sobre las rutas pero sin bloquearlas (SEOHead sigue activo) */}
        {loading && (
          <div
            className="fixed inset-0 z-[9999] grid place-items-center pointer-events-none transition-opacity duration-500"
            style={{
              background: '#060F27',
              opacity: fadeOut ? 0 : 1,
            }}
          >
            <LoadingScreen />
          </div>
        )}
      </Router>
    </Provider>
  );
}

export default App;
