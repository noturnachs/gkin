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
import { NotificationCenter } from "./notification-center";

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
  showDecoration = true,
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Header background and styling based on variant
  const getHeaderStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg border-b border-blue-900 relative overflow-hidden";
      case "gradient":
        return "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg relative overflow-hidden";
      default:
        return "bg-gradient-to-r from-gray-50 via-white to-gray-100 border-b-2 border-gray-200 shadow-sm relative overflow-hidden";
    }
  };

  // Text colors based on variant
  const getTextColors = () => {
    switch (variant) {
      case "primary":
      case "gradient":
        return {
          title: "text-white",
          subtitle: "text-blue-100",
          userText: "text-white",
          userRole: "text-blue-200",
        };
      default:
        return {
          title: "text-gray-900",
          subtitle: "text-gray-600",
          userText: "text-gray-800",
          userRole: "text-gray-500",
        };
    }
  };

  // Get appropriate icon based on title
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
    return <Home className="w-6 h-6" />; // Default to Home icon
  };

  const headerStyles = getHeaderStyles();
  const textColors = getTextColors();

  return (
    <header
      className={`${headerStyles} px-4 py-4 md:py-6 lg:px-6 ${className}`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        {/* Enhanced Title Section */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {/* Animated icon container */}
            <div
              className={`relative p-3 rounded-xl ${
                variant === "default"
                  ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 shadow-md"
                  : "bg-white/20 text-white shadow-lg backdrop-blur-sm"
              }`}
            >
              <div className="animate-pulse">{getHeaderIcon()}</div>
              {/* Subtle glow effect */}
              <div
                className={`absolute inset-0 rounded-xl ${
                  variant === "default" ? "bg-blue-200" : "bg-white"
                } opacity-20 blur-sm`}
              ></div>
            </div>

            <div className="flex-1">
              <h1
                className={`text-xl md:text-2xl lg:text-3xl font-bold ${textColors.title} tracking-tight`}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`text-sm md:text-base ${textColors.subtitle} mt-1 flex items-center gap-2`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile view: Enhanced User info and dropdown menu */}
        {showUserInfo && (
          <div className="md:hidden">
            {/* Enhanced user info button */}
            <Button
              variant={variant === "default" ? "outline" : "secondary"}
              className={`flex items-center gap-2 w-full justify-between py-2 px-4 h-11 min-h-0 ${
                variant === "default"
                  ? "bg-white border-gray-300 text-gray-800 hover:bg-gray-50 shadow-md"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-lg backdrop-blur-sm"
              }`}
              onClick={() => setShowMobileMenu((prev) => !prev)}
            >
              <div className="flex items-center gap-3">
                {/* User avatar placeholder */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    variant === "default"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-white/20 text-white"
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>

                <div className="flex flex-col items-start">
                  <span
                    className={`font-medium text-sm ${textColors.userText}`}
                  >
                    {user?.username || "User"}
                  </span>
                  <span className={`text-xs ${textColors.userRole}`}>
                    {user?.role?.name || "Role"}
                  </span>
                </div>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${
                  showMobileMenu ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </Button>

            {/* Enhanced dropdown menu with animations */}
            {showMobileMenu && (
              <div
                className={`flex flex-col gap-3 mt-3 p-4 rounded-xl shadow-xl border ${
                  variant === "default"
                    ? "bg-white border-gray-200"
                    : "bg-white/95 backdrop-blur-sm border-white/20"
                } animate-in slide-in-from-top-2 duration-300`}
              >
                {/* Resources section */}
                {showGoogleDrive && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-semibold text-gray-500 tracking-wider px-1">
                      Resources
                    </h4>
                    <Button
                      variant="outline"
                      className="flex items-center justify-start gap-3 w-full h-10 text-sm px-4 hover:bg-blue-50"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Google Drive</span>
                    </Button>
                  </div>
                )}

                {/* Notifications section */}
                {showNotifications && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-semibold text-gray-500 tracking-wider px-1">
                      Notifications
                    </h4>
                    <div className="flex justify-center scale-90 origin-left">
                      <NotificationCenter />
                    </div>
                  </div>
                )}

                {/* Account section */}
                {showLogout && (
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <h4 className="text-xs uppercase font-semibold text-gray-500 tracking-wider px-1">
                      Account
                    </h4>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 text-sm px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-3"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Desktop view: Enhanced horizontal layout */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {/* Notifications first */}
          {showNotifications && (
            <div className="order-1">
              <NotificationCenter />
            </div>
          )}

          {/* Enhanced Google Drive button */}
          {showGoogleDrive && (
            <Button
              variant={variant === "default" ? "outline" : "secondary"}
              className={`flex items-center gap-2 text-sm lg:text-base h-11 px-4 ${
                variant === "default"
                  ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-lg backdrop-blur-sm"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Google Drive</span>
            </Button>
          )}

          {/* Enhanced user info pill */}
          {showUserInfo && user && (
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-full border order-3 ${
                variant === "default"
                  ? "bg-white border-gray-300 shadow-md"
                  : "bg-white/20 border-white/30 text-white shadow-lg backdrop-blur-sm"
              }`}
            >
              {/* User avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  variant === "default"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-white/20 text-white"
                }`}
              >
                <span className="text-sm font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col">
                <span className={`font-medium text-sm ${textColors.userText}`}>
                  {user.username}
                </span>
                <span className={`text-xs ${textColors.userRole}`}>
                  {user.role?.name || "Role"}
                </span>
              </div>
            </div>
          )}

          {/* Enhanced logout button */}
          {showLogout && (
            <Button
              variant={variant === "default" ? "outline" : "secondary"}
              className={`text-sm lg:text-base h-11 px-4 ${
                variant === "default"
                  ? "bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 shadow-md"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-lg backdrop-blur-sm"
              }`}
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
