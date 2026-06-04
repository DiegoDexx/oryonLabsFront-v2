import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import './index.css';

// Layouts
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';

// Chat Widget
import ChatWidget from './components/ui/ChatWidget';

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
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* Rutas protegidas */}
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
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
