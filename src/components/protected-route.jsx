import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("currentUser");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
