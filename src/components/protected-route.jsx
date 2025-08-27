import { Navigate } from "react-router-dom";
import authService from "../services/authService";

export const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
