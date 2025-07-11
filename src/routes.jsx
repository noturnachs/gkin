import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { LoginPage } from "./components/login-page";
import { DocumentCreator } from "./components/document-creator";

// Auth guard for protected routes
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Routes configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/create-document",
    element: (
      <ProtectedRoute>
        <DocumentCreator />
      </ProtectedRoute>
    ),
  },
]); 