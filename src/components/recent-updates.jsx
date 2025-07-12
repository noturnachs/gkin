import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Badge } from "./ui/badge";

const mockUpdates = [
  {
    id: 1,
    type: "document",
    title: "Concept Document Created",
    description: "Liturgy for June 30th created",
    timestamp: "10 minutes ago",
    user: "Sarah K.",
    role: "Liturgy Maker",
    icon: FileText,
    color: "blue",
  },
  {
    id: 2,
    type: "review",
    title: "Pastor Review Complete",
    description: "Changes requested for June 23rd liturgy",
    timestamp: "2 hours ago",
    user: "Pastor Mike",
    role: "Pastor",
    icon: CheckCircle,
    color: "purple",
  },
  {
    id: 3,
    type: "workflow",
    title: "Step Complete",
    description: "Translation completed for June 16th",
    timestamp: "Yesterday",
    user: "Anna L.",
    role: "Translation Team",
    icon: ArrowRight,
    color: "green",
  },
  {
    id: 4,
    type: "message",
    title: "New Message",
    description: "Question about slide format",
    timestamp: "Yesterday",
    user: "Tom R.",
    role: "Beamer Team",
    icon: MessageSquare,
    color: "orange",
  },
  {
    id: 5,
    type: "deadline",
    title: "Upcoming Deadline",
    description: "Final document due in 2 days",
    timestamp: "2 days ago",
    user: "System",
    role: "",
    icon: Calendar,
    color: "red",
  },
];

export function RecentUpdates({ limit = 5 }) {
  // In a real app, you would fetch this data from an API
  const updates = mockUpdates.slice(0, limit);

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      green: "text-green-600",
      orange: "text-orange-600",
      red: "text-red-600",
      gray: "text-gray-600",
    };
    return colors[color] || colors.gray;
  };

  const getBgColor = (color) => {
    const colors = {
      blue: "bg-blue-50",
      purple: "bg-purple-50",
      green: "bg-green-50",
      orange: "bg-orange-50",
      red: "bg-red-50",
      gray: "bg-gray-50",
    };
    return colors[color] || colors.gray;
  };

  const getBorderColor = (color) => {
    const colors = {
      blue: "border-blue-100",
      purple: "border-purple-100",
      green: "border-green-100",
      orange: "border-orange-100",
      red: "border-red-100",
      gray: "border-gray-100",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-3">
      {updates.map((update) => {
        const IconComponent = update.icon;

        return (
          <div
            key={update.id}
            className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div
              className={`p-2 rounded-full ${getBgColor(
                update.color
              )} ${getBorderColor(update.color)} border`}
            >
              <IconComponent
                className={`w-4 h-4 ${getIconColor(update.color)}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium text-sm text-gray-900">
                  {update.title}
                </h4>
                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                  {update.timestamp}
                </span>
              </div>

              <p className="text-xs text-gray-600 mt-0.5 mb-1">
                {update.description}
              </p>

              <div className="flex items-center gap-2 mt-1">
                {update.user !== "System" && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-[10px] text-gray-500">
                      {update.user}
                    </span>
                  </div>
                )}

                {update.role && (
                  <Badge
                    variant="outline"
                    className="h-4 px-1 text-[9px] bg-gray-50 border-gray-200 text-gray-600"
                  >
                    {update.role}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <button className="w-full text-center text-xs text-blue-600 hover:text-blue-700 py-1 hover:underline">
        View all updates
      </button>
    </div>
  );
}
