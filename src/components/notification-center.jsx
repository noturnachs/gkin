import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
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
    color: "text-orange-600",
  },
  {
    id: 2,
    type: "completed",
    title: "Translation completed",
    description: "December 31 service translation finished",
    time: "1 day ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "email",
    title: "Email sent to beamer team",
    description: "January 7 service materials forwarded",
    time: "3 hours ago",
    icon: Mail,
    color: "text-blue-600",
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.type === "action").length;
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(event.target) && 
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!buttonRef.current) return {};
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    
    // For mobile screens, position the dropdown centered
    if (windowWidth < 640) {
      return {
        position: 'fixed',
        top: `${buttonRect.bottom + window.scrollY + 5}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', // Full width minus margin
        maxWidth: '400px'
      };
    }
    
    // For larger screens, position it to the right of the button
    return {
      position: 'absolute',
      top: '100%',
      right: '0',
      marginTop: '8px',
      width: '320px'
    };
  };

  return (
    <div className="relative z-30">
      <Button 
        ref={buttonRef}
        variant="outline" 
        size="sm" 
        className="relative bg-white border border-gray-300 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-4 h-4 text-gray-700" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 text-white">
            {unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="z-50 shadow-lg"
          style={getDropdownPosition()}
        >
          <Card className="border border-gray-200 bg-white shadow-lg">
            <CardHeader className="pb-3 bg-white">
              <CardTitle className="text-sm text-gray-900">Notifications</CardTitle>
              <CardDescription className="text-gray-600">Recent activity and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 bg-white">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 bg-white"
                >
                  <notification.icon className={`w-4 h-4 mt-0.5 ${notification.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-600">{notification.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                >
                  View all notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 