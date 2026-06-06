import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import './index.css';

import Layout from './components/layouts/Layout';

// Pages
import Home from './pages/home';
import FAQ from './pages/faq';
import AdminPanel from './pages/adminPanel';
import Login from './pages/login';
import PrivateRoute from './components/ui/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Redirect root to /es */}
          <Route path="/" element={<Navigate to="/es" replace />} />
          
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
      </Router>
    </Provider>
  );
}

export default App;
