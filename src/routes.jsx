import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Dashboard from "./components/dashboard"; // Changed from { Dashboard }
import { LoginPage } from "./components/login-page";
import { DocumentCreator } from "./components/document-creator";
import { EmailComposerPage } from "./components/email-composer-page";
import { ProtectedRoute } from "./components/protected-route";

// Routes configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "create-document",
        element: (
          <ProtectedRoute>
            <DocumentCreator />
          </ProtectedRoute>
        ),
      },
      {
        path: "compose-email",
        element: (
          <ProtectedRoute>
            <EmailComposerPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
