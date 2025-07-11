import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { FileText, Upload, MessageSquare, Send, CheckCircle, Edit, Lock } from "lucide-react";
import { useState } from "react";
import { DocumentCreator } from "./document-creator";

const roleActions = {
  liturgy: [
    {
      id: "create-concept",
      title: "Create Concept Document",
      icon: FileText,
      description: "Start new liturgy concept",
      step: 1
    },
    { 
      id: "update-document", 
      title: "Update Document", 
      icon: Edit, 
      description: "Apply pastor feedback",
      step: 3
    },
    { 
      id: "finalize-document", 
      title: "Finalize Document", 
      icon: CheckCircle, 
      description: "Complete final version",
      step: 4
    }
  ],
  pastor: [
    {
      id: "review-concept",
      title: "Review Concept",
      icon: Edit,
      description: "Review liturgy concept",
      step: 2
    }
  ],
  translation: [
    {
      id: "translate-document",
      title: "Translate Document",
      icon: MessageSquare,
      description: "Translate final document",
      step: 5
    }
  ],
  beamer: [
    {
      id: "create-slides",
      title: "Create Slides",
      icon: Upload,
      description: "Create presentation slides",
      step: 6
    }
  ],
  music: [
    {
      id: "prepare-music",
      title: "Prepare Music",
      icon: Send,
      description: "Prepare music sheets",
      step: 6
    }
  ]
};

// Using the newer implementation that matches what App.jsx expects
export function ActionPanel({ role, service, currentUserRole, onStartAction }) {
  const actions = roleActions[role.id] || [];
  const isCurrentUserRole = currentUserRole === role.id;
  const [activeAction, setActiveAction] = useState(null);

  const handleActionClick = (actionId) => {
    if (isCurrentUserRole && onStartAction) {
      if (actionId === "create-concept") {
        onStartAction(1); // Step ID 1 for Concept Creation
      }
      // Handle other actions as needed
    }
  };

  const handleActionComplete = (data) => {
    // Here you would typically send this data to your backend
    console.log("Action completed:", activeAction, data);
    
    // For now, just close the action UI
    setActiveAction(null);
    
    // Show success notification (you could implement this)
    alert(`Document ${data ? "created successfully!" : "creation cancelled."}`);
  };

  // If there's an active action, show the appropriate component
  if (activeAction === "create-concept") {
    return <DocumentCreator onComplete={handleActionComplete} />;
  }

  // Otherwise show the regular action panel
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
          onClick={() => handleActionClick(action.id)}
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