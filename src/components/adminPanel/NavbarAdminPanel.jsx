import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import { apiLogout } from "../../api/apiActions";

const NavbarAdminPanel = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const token      = useSelector((state) => state.auth.token);
  const user       = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await apiLogout(token);
    } catch {
      // Si falla la llamada al backend igual limpiamos la sesión local
    } finally {
      navigate("/login");    // unmount AdminPanel antes de limpiar Redux
      dispatch(logoutUser());
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-6">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">O</span>
        </div>
        <span className="font-bold text-navy text-base">OryonX</span>
        <span className="text-xs bg-cyan/10 text-cyan font-semibold px-2 py-0.5 rounded-full">
          Admin
        </span>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-500 hidden sm:block">
            {user.name || user.email}
          </span>
        )}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
          )}
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default NavbarAdminPanel;
