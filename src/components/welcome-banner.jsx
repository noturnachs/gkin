import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, X } from "lucide-react";
import { useState } from "react";

export function WelcomeBanner({ userName, roleName, onStartAction, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-gray-900">Welcome, {userName}!</h2>
            <p className="text-gray-600 mt-1">
              As the <span className="font-medium">{roleName}</span>, your first task is to create the liturgy concept document.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onStartAction && onStartAction(1)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Liturgy Document
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={handleDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 