import { Badge } from "./ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  FileText,
  Upload,
  Edit,
  MessageSquare,
  Send,
  Lock,
  ExternalLink,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const workflowSteps = [
  {
    id: 1,
    name: "Concept Creation",
    role: "Liturgy Maker",
    icon: FileText,
    description: "Create initial liturgy concept document",
    actionLabel: "Create Document",
  },
  {
    id: 2,
    name: "Pastor Review",
    role: "Pastor",
    icon: Eye,
    description: "Pastor reviews and provides feedback",
    actionLabel: "Review Document",
  },
  {
    id: 3,
    name: "Document Update",
    role: "Liturgy Maker",
    icon: Edit,
    description: "Update document based on feedback",
    actionLabel: "Update Document",
  },
  {
    id: 4,
    name: "Final Version",
    role: "Liturgy Maker",
    icon: CheckCircle,
    description: "Finalize document for translation",
    actionLabel: "Finalize Document",
  },
  {
    id: 5,
    name: "Translation",
    role: "Translation Team",
    icon: MessageSquare,
    description: "Translate document to required languages",
    actionLabel: "Translate Document",
  },
  {
    id: 6,
    name: "Beamer Prep",
    role: "Beamer Team",
    icon: Send,
    description: "Prepare presentation slides",
    actionLabel: "Create Slides",
  },
  {
    id: 7,
    name: "Complete",
    role: "System",
    icon: CheckCircle,
    description: "Workflow complete",
    actionLabel: null,
  },
];

export function WorkflowBoard({ service, currentUserRole, onStartAction }) {
  const [expandedStep, setExpandedStep] = useState(null);

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

  const getActionIcon = (stepId) => {
    switch (stepId) {
      case 1:
        return FileText;
      case 2:
        return Eye;
      case 3:
        return Edit;
      case 4:
        return CheckCircle;
      case 5:
        return MessageSquare;
      case 6:
        return Send;
      default:
        return Clock;
    }
  };

  const toggleExpandStep = (stepId) => {
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
    }
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
          const isPending = status === "pending";
          const isCompleted = status === "completed";
          const isExpanded = expandedStep === step.id;
          const ActionIcon = getActionIcon(step.id);

          return (
            <div key={step.id} className="flex flex-col gap-1">
              <div
                className={`flex items-center gap-2 md:gap-4 ${
                  isActiveUserStep ? "cursor-pointer" : ""
                }`}
                onClick={
                  isActiveUserStep ? () => toggleExpandStep(step.id) : undefined
                }
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartAction && onStartAction(step.id);
                      }}
                    >
                      <ActionIcon className="w-3 h-3 mr-1 hidden sm:inline" />
                      <span className="sm:hidden">Start</span>
                      <span className="hidden sm:inline">
                        {step.actionLabel || `Start ${step.name}`}
                      </span>
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

              {/* Expanded details for active user steps */}
              {isExpanded && isActiveUserStep && (
                <div className="ml-6 mr-2 mb-2 p-3 bg-white border border-blue-200 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-600 mb-3">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                      onClick={() => onStartAction && onStartAction(step.id)}
                    >
                      <ActionIcon className="w-3 h-3 mr-1" />
                      {step.actionLabel || `Start ${step.name}`}
                    </Button>

                    {step.id === 1 && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 h-8"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload Existing
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 h-8"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Templates
                        </Button>
                      </>
                    )}

                    {step.id === 2 && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 h-8"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download Document
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 h-8"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Send Feedback
                        </Button>
                      </>
                    )}

                    {step.id === 3 && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 h-8"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Feedback
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 h-8"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload Revised
                        </Button>
                      </>
                    )}

                    {(step.id === 4 || step.id === 5 || step.id === 6) && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 h-8"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download Files
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 h-8"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Ask Questions
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* View-only info for non-user roles when active */}
              {status === "active" && !isUserRole && (
                <div className="ml-6 mr-2 mb-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      Waiting for {step.role} to complete this step
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
