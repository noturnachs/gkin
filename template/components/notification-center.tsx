import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Mail, AlertCircle, CheckCircle } from "lucide-react"

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
]

export function NotificationCenter() {
  const unreadCount = notifications.filter((n) => n.type === "action").length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notifications</CardTitle>
            <CardDescription>Recent activity and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <notification.icon className={`w-4 h-4 mt-0.5 ${notification.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
