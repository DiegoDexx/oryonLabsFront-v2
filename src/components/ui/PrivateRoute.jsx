import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles = [] }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length && user && !roles.some((r) => user.roles.includes(r))) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PrivateRoute;
