import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { FileText, Upload, MessageSquare, Send, CheckCircle, Edit, Lock } from "lucide-react";

const roleActions = {
  liturgy: [
    {
      id: "create-concept",
      title: "Create Concept Document",
      icon: FileText,
      description: "Start new liturgy concept",
    },
    { id: "update-document", title: "Update Document", icon: Edit, description: "Apply pastor feedback" },
    { id: "finalize", title: "Create Final Version", icon: CheckCircle, description: "Prepare final document" },
    { id: "send-translation", title: "Send to Translation", icon: Send, description: "Forward to translation team" },
  ],
  pastor: [
    { id: "review", title: "Review Document", icon: FileText, description: "Review liturgy concept" },
    { id: "add-comments", title: "Add Comments", icon: MessageSquare, description: "Provide feedback" },
    { id: "approve", title: "Approve Document", icon: CheckCircle, description: "Approve for next step" },
  ],
  translation: [
    { id: "translate", title: "Translate Document", icon: FileText, description: "Translate liturgy content" },
    {
      id: "upload-translation",
      title: "Upload Translation",
      icon: Upload,
      description: "Upload completed translation",
    },
    { id: "send-beamer", title: "Send to Beamer Team", icon: Send, description: "Forward to beamer team" },
  ],
  beamer: [
    { id: "prepare-slides", title: "Prepare Slides", icon: FileText, description: "Create presentation slides" },
    { id: "upload-slides", title: "Upload Slides", icon: Upload, description: "Upload completed slides" },
    { id: "mark-complete", title: "Mark Complete", icon: CheckCircle, description: "Mark workflow as complete" },
  ],
  music: [
    { id: "review-music", title: "Review Music List", icon: FileText, description: "Review selected music" },
    { id: "prepare-music", title: "Prepare Music", icon: FileText, description: "Prepare musical arrangements" },
    { id: "confirm-ready", title: "Confirm Ready", icon: CheckCircle, description: "Confirm music is ready" },
  ],
};

export function ActionPanel({ role, service, currentUserRole }) {
  const actions = roleActions[role.id] || [];
  const isCurrentUserRole = currentUserRole === role.id;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${role.color}`} />
        <span className="font-medium text-gray-900">{role.name}</span>
        {!isCurrentUserRole && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            View Only
          </span>
        )}
      </div>

      {actions.map((action) => (
        <Card 
          key={action.id} 
          className={`cursor-pointer hover:shadow-md transition-shadow bg-white border ${
            isCurrentUserRole ? 'border-gray-200' : 'border-gray-100'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <action.icon className={`w-5 h-5 mt-0.5 ${isCurrentUserRole ? 'text-gray-700' : 'text-gray-400'}`} />
              <div className="flex-1">
                <h4 className={`font-medium text-sm ${isCurrentUserRole ? 'text-gray-900' : 'text-gray-500'}`}>
                  {action.title}
                </h4>
                <p className={`text-xs ${isCurrentUserRole ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                  {action.description}
                </p>
              </div>
              {isCurrentUserRole ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                >
                  Start
                </Button>
              ) : (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Lock className="w-3 h-3" />
                  <span>Restricted</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {isCurrentUserRole && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-sm text-blue-900 mb-2">Quick Actions</h4>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
            >
              <Send className="w-3 h-3 mr-1" />
              Send Email
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
            >
              <FileText className="w-3 h-3 mr-1" />
              View Docs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}