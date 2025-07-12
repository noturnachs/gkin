import { Badge } from "./ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  FileText,
  Upload,
  Edit,
} from "lucide-react";
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
        <span className="text-[10px] md:text-xs bg-blue-600 text-white px-1.5 md:px-2 py-0.5 rounded-full ml-auto">
          Action Required
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-2 md:space-y-4">
      <div className="grid grid-cols-1 gap-2 md:gap-3">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const IconComponent = getIcon(status, step.icon);
          const isUserRole =
            step.role && step.role.toLowerCase().includes(currentUserRole);
          const isActiveUserStep = status === "active" && isUserRole;

          return (
            <div key={step.id} className="flex items-center gap-2 md:gap-4">
              <div
                className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border flex-1 ${getStepColor(
                  status,
                  step.role
                )}`}
              >
                <IconComponent
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    status === "active" ? "text-blue-600 animate-pulse" : ""
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs md:text-sm truncate">
                    {step.name}
                  </div>
                  <div className="text-[10px] md:text-xs opacity-75 truncate">
                    {step.role}
                  </div>
                </div>

                {isActiveUserStep && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 mr-1 md:mr-2 h-7 md:h-8 text-[10px] md:text-xs px-1.5 md:px-2 min-h-0 whitespace-nowrap"
                    onClick={() => onStartAction && onStartAction(step.id)}
                  >
                    {step.id === 1 ? (
                      <>
                        <FileText className="w-3 h-3 mr-1 hidden sm:inline" />
                        <span className="sm:hidden">Create</span>
                        <span className="hidden sm:inline">
                          Create Document
                        </span>
                      </>
                    ) : (
                      <>
                        {step.id === 3 ? (
                          <Edit className="w-3 h-3 mr-1 hidden sm:inline" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1 hidden sm:inline" />
                        )}
                        <span className="sm:hidden">Start</span>
                        <span className="hidden sm:inline">
                          Start {step.name}
                        </span>
                      </>
                    )}
                  </Button>
                )}

                <Badge
                  variant={status === "completed" ? "default" : "secondary"}
                  className="text-[9px] md:text-xs h-5 md:h-6 px-1 md:px-2 min-w-[52px] md:min-w-[60px] flex items-center justify-center"
                >
                  {status}
                </Badge>
              </div>
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
