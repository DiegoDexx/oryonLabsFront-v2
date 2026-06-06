import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from '../ui/ChatWidget';

export default function Layout() {
  const location = useLocation();
  
  // No mostrar layout en admin/login
  if (location.pathname.includes('adminpanel') || location.pathname.includes('login')) {
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
      <ChatWidget />
    </>
  );
}
