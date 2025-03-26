import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ userId }: { userId?: string }) => {
  return userId ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
