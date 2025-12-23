import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
