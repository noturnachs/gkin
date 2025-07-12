import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Bell, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const notifications = [
  {
    id: 1,
    type: "action",
    title: "Pastor review needed",
    description: "January 7 service concept awaiting review",
    time: "2 hours ago",
    icon: AlertCircle,
    color: "text-orange-700", // Darker orange for better contrast
    bgColor: "bg-orange-50",
  },
  {
    id: 2,
    type: "completed",
    title: "Translation completed",
    description: "December 31 service translation finished",
    time: "1 day ago",
    icon: CheckCircle,
    color: "text-green-700", // Darker green for better contrast
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    type: "email",
    title: "Email sent to beamer team",
    description: "January 7 service materials forwarded",
    time: "3 hours ago",
    icon: Mail,
    color: "text-blue-700", // Darker blue for better contrast
    bgColor: "bg-blue-50",
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.type === "action").length;
  const buttonRef = useRef(null);

  // We don't need dropdown positioning logic anymore
  // since we're embedding the notifications directly in the layout

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="outline"
        size="sm"
        className="relative bg-white border border-gray-400 hover:bg-gray-100 shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-4 h-4 text-gray-800" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-700 text-white font-medium shadow-sm">
            {unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}

// Create a separate component for the notification panel content
export function NotificationPanel() {
  return (
    <Card className="border border-gray-300 bg-white shadow-lg overflow-hidden w-full mt-3">
      <CardHeader className="pb-3 bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-sm font-semibold text-gray-900">
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-700">
          Recent activity and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 bg-white p-0">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 ${
              notification.type === "action" ? "bg-yellow-50" : "bg-white"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0`}
            >
              <notification.icon className={`w-4 h-4 ${notification.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="text-xs text-gray-700">
                {notification.description}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1"></span>
                {notification.time}
              </p>
            </div>
            {notification.type === "action" && (
              <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                Action
              </span>
            )}
          </div>
        ))}
        <div className="p-2 bg-gray-50 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs font-medium text-blue-800 hover:bg-blue-50 hover:text-blue-900 border border-blue-100"
          >
            View all notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
