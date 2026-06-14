import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import './index.css';

import Layout from './components/layouts/Layout';
import LoadingScreen from './components/ui/LoadingScreen';

// Pages
import Home from './pages/home';
import FAQ from './pages/faq';
import AdminPanel from './pages/adminPanel';
import Login from './pages/login';
import PrivateRoute from './components/ui/PrivateRoute';

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
    const hideTimer = setTimeout(() => setLoading(false), 3100);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Redirect root to /es */}
          <Route path="/" element={<Navigate to={navigator.language?.startsWith('en') ? '/en' : '/es'} replace />} />

          {/* Routes with language prefix */}
          <Route path="/:lang" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="faq" element={<FAQ />} />
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
        </Routes>

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
