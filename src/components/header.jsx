import { useState } from "react";
import { Button } from "./ui/button";
import {
  FileText,
  BookOpen,
  Calendar,
  Users,
  Settings,
  Home,
} from "lucide-react";
import { NotificationCenter, NotificationPanel } from "./notification-center";

export function Header({
  title = "Liturgy Workflow",
  subtitle = "Manage document workflow for weekly services",
  user,
  onLogout,
  showGoogleDrive = true,
  showNotifications = true,
  showUserInfo = true,
  showLogout = true,
  className = "",
  variant = "default", // "default", "primary", "gradient"
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Icon logic
  const getHeaderIcon = () => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("liturgy") || titleLower.includes("workflow")) {
      return <BookOpen className="w-6 h-6" />;
    } else if (
      titleLower.includes("calendar") ||
      titleLower.includes("schedule")
    ) {
      return <Calendar className="w-6 h-6" />;
    } else if (titleLower.includes("team") || titleLower.includes("users")) {
      return <Users className="w-6 h-6" />;
    } else if (
      titleLower.includes("admin") ||
      titleLower.includes("settings")
    ) {
      return <Settings className="w-6 h-6" />;
    }
    return <Home className="w-6 h-6" />;
  };

  // Color logic
  const textColors =
    variant === "primary" || variant === "gradient"
      ? {
          title: "text-white",
          subtitle: "text-blue-100",
          userText: "text-white",
          userRole: "text-blue-200",
        }
      : {
          title: "text-gray-900",
          subtitle: "text-gray-600",
          userText: "text-gray-800",
          userRole: "text-gray-500",
        };

  // Header background
  const headerBg =
    variant === "primary"
      ? "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg border-b border-blue-900"
      : variant === "gradient"
      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg"
      : "bg-gradient-to-r from-gray-50 via-white to-gray-100 border-b-2 border-gray-200 shadow-sm";

  return (
    <header className={`${headerBg} px-4 py-4 md:py-6 lg:px-6 ${className}`}>
      {/* Mobile Layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Top row: Title and menu button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              {getHeaderIcon()}
            </div>
            <div>
              <h1 className={`text-lg font-bold ${textColors.title}`}>
                {title}
              </h1>
              {subtitle && (
                <p className={`text-xs ${textColors.subtitle}`}>{subtitle}</p>
              )}
            </div>
          </div>
          {/* User menu button */}
          {showUserInfo && (
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => setShowMobileMenu((prev) => !prev)}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-xs font-medium">{user?.username}</span>
              </div>
            </Button>
          )}
        </div>
        {/* Actions row */}
        <div className="flex items-center gap-2">
          {showNotifications && (
            <div
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            >
              <NotificationCenter />
            </div>
          )}
          {showGoogleDrive && (
            <Button
              variant="outline"
              className="flex items-center gap-2 text-xs px-2 py-1"
            >
              <FileText className="w-4 h-4" />
              Google Drive
            </Button>
          )}
          {showLogout && (
            <Button
              variant="outline"
              className="text-xs px-2 py-1"
              onClick={onLogout}
            >
              Logout
            </Button>
          )}
        </div>

        {/* Notification Panel - Expands within the header */}
        {showNotificationPanel && (
          <div className="mt-2">
            <NotificationPanel />
          </div>
        )}

        {/* Mobile user menu dropdown */}
        {showMobileMenu && (
          <div className="mt-2 rounded-lg border border-gray-200 bg-white shadow-lg p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="font-medium text-sm">{user?.username}</div>
                <div className="text-xs text-gray-500">
                  {user?.role?.name || "Role"}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full text-xs"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between gap-4">
        {/* Left: Title and subtitle */}
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            {getHeaderIcon()}
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${textColors.title}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-sm ${textColors.subtitle}`}>{subtitle}</p>
            )}
          </div>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {showNotifications && (
            <div className="relative">
              <div
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
              >
                <NotificationCenter />
              </div>
              {showNotificationPanel && (
                <div className="absolute right-0 mt-2 z-50">
                  <div className="w-80">
                    <NotificationPanel />
                  </div>
                </div>
              )}
            </div>
          )}
          {showGoogleDrive && (
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              Google Drive
            </Button>
          )}
          {showUserInfo && user && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-300">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-sm text-gray-800">
                {user.username}
              </span>
              <span className="text-xs text-gray-500">
                {user.role?.name || "Role"}
              </span>
            </div>
          )}
          {showLogout && (
            <Button variant="outline" className="text-sm" onClick={onLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
