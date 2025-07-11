import { Badge } from "./ui/badge";
import { CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";

const workflowSteps = [
  { id: 1, name: "Concept Creation", role: "Liturgy Maker", icon: Clock },
  { id: 2, name: "Pastor Review", role: "Pastor", icon: Clock },
  { id: 3, name: "Document Update", role: "Liturgy Maker", icon: Clock },
  { id: 4, name: "Final Version", role: "Liturgy Maker", icon: Clock },
  { id: 5, name: "Translation", role: "Translation Team", icon: Clock },
  { id: 6, name: "Beamer Prep", role: "Beamer Team", icon: Clock },
  { id: 7, name: "Complete", role: "System", icon: CheckCircle },
];

export function WorkflowBoard({ service }) {
  const getStepStatus = (stepId) => {
    if (!service) return "pending";
    if (stepId < service.currentStep) return "completed";
    if (stepId === service.currentStep) return "active";
    return "pending";
  };

  const getStepColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-300 text-green-800";
      case "active":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "pending":
        return "bg-gray-100 border-gray-300 text-gray-600";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  const getIcon = (status, IconComponent) => {
    if (status === "completed") return CheckCircle;
    if (status === "active") return AlertCircle;
    return IconComponent;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const IconComponent = getIcon(status, step.icon);

          return (
            <div key={step.id} className="flex items-center gap-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg border-2 flex-1 ${getStepColor(status)}`}>
                <IconComponent className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-sm opacity-75">{step.role}</div>
                </div>
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