import { Badge } from "./ui/badge";
import { CheckCircle, Clock, AlertCircle, ArrowRight, FileText, Upload, Edit } from "lucide-react";
import { Button } from "./ui/button";

const workflowSteps = [
  { id: 1, name: "Concept Creation", role: "Liturgy Maker", icon: Clock },
  { id: 2, name: "Pastor Review", role: "Pastor", icon: Clock },
  { id: 3, name: "Document Update", role: "Liturgy Maker", icon: Clock },
  { id: 4, name: "Final Version", role: "Liturgy Maker", icon: Clock },
  { id: 5, name: "Translation", role: "Translation Team", icon: Clock },
  { id: 6, name: "Beamer Prep", role: "Beamer Team", icon: Clock },
  { id: 7, name: "Complete", role: "System", icon: CheckCircle },
];

export function WorkflowBoard({ service, currentUserRole, onStartAction }) {
  const getStepStatus = (stepId) => {
    if (!service) return "pending";
    if (stepId < service.currentStep) return "completed";
    if (stepId === service.currentStep) return "active";
    return "pending";
  };

  const getStepColor = (status, role) => {
    // Highlight the current user's role steps
    const isUserRole = role && role.toLowerCase().includes(currentUserRole);
    
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-300 text-green-800";
      case "active":
        return isUserRole 
          ? "bg-blue-100 border-blue-500 border-2 text-blue-800 shadow-sm" 
          : "bg-blue-50 border-blue-300 text-blue-700";
      case "pending":
        return isUserRole
          ? "bg-gray-100 border-gray-300 text-gray-700"
          : "bg-gray-50 border-gray-200 text-gray-600";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  const getIcon = (status, IconComponent) => {
    if (status === "completed") return CheckCircle;
    if (status === "active") return AlertCircle;
    return IconComponent;
  };

  const getActionLabel = (status, role) => {
    const isUserRole = role && role.toLowerCase().includes(currentUserRole);
    
    if (status === "completed") return null;
    if (status === "active" && isUserRole) {
      return (
        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full ml-auto">
          Action Required
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const IconComponent = getIcon(status, step.icon);
          const isUserRole = step.role && step.role.toLowerCase().includes(currentUserRole);
          const isActiveUserStep = status === "active" && isUserRole;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg border flex-1 ${getStepColor(status, step.role)}`}>
                <IconComponent className={`w-5 h-5 ${status === "active" ? "text-blue-600 animate-pulse" : ""}`} />
                <div className="flex-1">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-sm opacity-75">{step.role}</div>
                </div>
                
                {isActiveUserStep && (
                  <Button 
                    size="sm"
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 mr-2"
                    onClick={() => onStartAction && onStartAction(step.id)}
                  >
                    {step.id === 1 ? (
                      <>
                        <FileText className="w-3 h-3 mr-1" />
                        Create Document
                      </>
                    ) : (
                      <>
                        {step.id === 3 ? <Edit className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        Start {step.name}
                      </>
                    )}
                  </Button>
                )}
                
                <Badge variant={status === "completed" ? "default" : "secondary"}>{status}</Badge>
              </div>
              {index < workflowSteps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
} 