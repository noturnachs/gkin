import { Badge } from "./ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Edit,
  MessageSquare,
  Send,
  Book,
  QrCode,
  File,
  ChevronDown,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { DocumentCreatorModal } from "./document-creator-modal";
import { SermonCreatorModal } from "./sermon-creator-modal";

// Main task categories with their subtasks
const workflowCategories = [
  {
    id: "liturgy",
    name: "Liturgy Tasks",
    role: "Liturgy Maker",
    icon: FileText,
    color: "bg-blue-100 border-blue-300 text-blue-800",
    subtasks: [
      {
        id: "concept",
        name: "Concept Document",
        icon: FileText,
        description: "Create initial liturgy concept",
        actionLabel: "Create Document",
      },
      {
        id: "sermon",
        name: "Sermon Document",
        icon: Book,
        description: "Prepare sermon document",
        actionLabel: "Create Sermon",
      },
      {
        id: "qrcode",
        name: "QR Code",
        icon: QrCode,
        description: "Generate and upload QR codes for donations",
        actionLabel: "Upload QR Code",
        restrictedTo: "treasurer", // Only treasurer can perform this action
      },
      {
        id: "final",
        name: "Final Document",
        icon: File,
        description: "Finalize all liturgy documents",
        actionLabel: "Finalize",
      },
    ],
  },
  {
    id: "translation",
    name: "Translation Tasks",
    role: "Translation Team",
    icon: MessageSquare,
    color: "bg-green-100 border-green-300 text-green-800",
    subtasks: [
      {
        id: "translate-liturgy",
        name: "Translate Liturgy",
        icon: MessageSquare,
        description: "Translate liturgy content",
        actionLabel: "Translate",
      },
      {
        id: "translate-sermon",
        name: "Translate Sermon",
        icon: Book,
        description: "Translate sermon content",
        actionLabel: "Translate",
      },
    ],
  },
  {
    id: "beamer",
    name: "Beamer Tasks",
    role: "Beamer Team",
    icon: Send,
    color: "bg-orange-100 border-orange-300 text-orange-800",
    subtasks: [
      {
        id: "slides",
        name: "Create Slides",
        icon: Send,
        description: "Create presentation slides",
        actionLabel: "Create Slides",
      },
    ],
  },
];

export function WorkflowBoard({ service, currentUserRole, onStartAction }) {
  const [expandedCategories, setExpandedCategories] = useState({
    liturgy: true, // Open by default
    translation: false,
    beamer: false,
  });

  // Local state to track QR code upload status for simulation
  const [qrCodeStatus, setQrCodeStatus] = useState(
    service?.taskStatuses?.qrcode || "pending"
  );

  // Add these states for both modals
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isSermonModalOpen, setIsSermonModalOpen] = useState(false);
  const [currentDocumentType, setCurrentDocumentType] = useState("concept");

  // Helper function to check role more easily
  const hasRole = (roleId) => {
    if (!currentUserRole) return false;

    // Handle string roles
    if (typeof currentUserRole === "string") {
      return currentUserRole.toLowerCase() === roleId.toLowerCase();
    }

    // Handle object roles
    if (typeof currentUserRole === "object") {
      // Check direct id
      if (
        currentUserRole.id &&
        currentUserRole.id.toLowerCase() === roleId.toLowerCase()
      ) {
        return true;
      }

      // Check nested role object
      if (
        currentUserRole.role &&
        currentUserRole.role.id &&
        currentUserRole.role.id.toLowerCase() === roleId.toLowerCase()
      ) {
        return true;
      }
    }

    return false;
  };

  // Update the role checking for the pastor
  const isPastor = hasRole("pastor");

  // Also update the liturgy maker role check
  const isLiturgyMaker = hasRole("liturgy");

  // And update the treasurer role check
  const isTreasurer = hasRole("treasurer");

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getTaskStatus = (taskId) => {
    // Special handling for qrcode task to use local state
    if (taskId === "qrcode") {
      return qrCodeStatus;
    }

    if (!service || !service.taskStatuses) return "pending";
    return service.taskStatuses[taskId] || "pending";
  };

  // Check if the current user can work on this category
  const isUserCategory = (roleStr) => {
    if (!roleStr || !currentUserRole) return false;

    // Handle when currentUserRole is an object with an id property
    const userRoleId =
      typeof currentUserRole === "object" && currentUserRole.role
        ? currentUserRole.role.id.toLowerCase() // Access the nested role object
        : typeof currentUserRole === "object" && currentUserRole.id
        ? currentUserRole.id.toLowerCase()
        : currentUserRole.toLowerCase();

    return roleStr.toLowerCase().includes(userRoleId);
  };

  // Handle QR code upload simulation
  const handleQrCodeAction = (stage) => {
    if (stage === "upload") {
      setQrCodeStatus("active");
      // Simulate processing time
      setTimeout(() => {
        setQrCodeStatus("completed");
      }, 2000);
    } else {
      onStartAction && onStartAction("qrcode");
    }
  };

  // This function will handle sermon submission from the modal
  const handleSermonSubmit = (sermonData) => {
    // Here you would handle the saved sermon
    console.log("Sermon submitted:", sermonData);

    // Update the service status for this task if needed
    if (onStartAction) {
      onStartAction(`sermon-completed`);
    }

    // Show a success message
    alert(`Sermon "${sermonData.sermonTitle}" has been saved successfully!`);
  };

  // This function will handle document submission from the modal
  const handleDocumentSubmit = (documentData) => {
    // Here you would handle the saved document
    console.log("Document submitted:", documentData);

    // Update the service status for this task if needed
    if (onStartAction) {
      onStartAction(`${documentData.documentType}-completed`);
    }

    // Show a success message
    alert(`${documentData.documentTitle} has been saved successfully!`);
  };

  // Update your handleActionStart function to use the new helper
  const handleActionStart = (taskId) => {
    console.log(`Action started for task: ${taskId}`); // Add this for debugging

    // For sermon task, open the sermon modal if pastor
    if (taskId === "sermon" && hasRole("pastor")) {
      setIsSermonModalOpen(true);
    }
    // For document creation tasks, open the document modal for liturgy maker
    else if (
      (taskId === "concept" || taskId === "final") &&
      hasRole("liturgy")
    ) {
      setCurrentDocumentType(taskId);
      setIsDocumentModalOpen(true);
    } else {
      // For other actions, use the original handler
      onStartAction && onStartAction(taskId);
    }
  };

  // Helper function to log role information for debugging
  useEffect(() => {
    console.log("Current user role:", currentUserRole);
    console.log("Is treasurer check:", isTreasurer);
  }, [currentUserRole, isTreasurer]);

  return (
    <div className="space-y-3 md:space-y-4">
      {workflowCategories.map((category) => {
        const isCurrentUserCategory = isUserCategory(category.role);
        const isCategoryExpanded = expandedCategories[category.id];

        // Skip categories that don't match user's role if filtering is desired
        // if (!isCurrentUserCategory && currentUserRole !== "pastor") return null;

        return (
          <div
            key={category.id}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            {/* Category Header */}
            <div
              className={`flex items-center gap-3 p-3 cursor-pointer ${category.color}`}
              onClick={() => toggleCategory(category.id)}
            >
              <category.icon className="w-5 h-5" />
              <div className="flex-1 font-medium">{category.name}</div>
              {isCategoryExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>

            {/* Subtasks */}
            {isCategoryExpanded && (
              <div className="p-2 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {category.subtasks.map((task) => {
                    const status = getTaskStatus(task.id);
                    const isCompleted = status === "completed";
                    const isActive = status === "active";

                    // Special handling for QR code task
                    const isQrCodeTask = task.id === "qrcode";
                    const canPerformTask =
                      !task.restrictedTo ||
                      task.restrictedTo === currentUserRole?.toLowerCase();

                    return (
                      <div
                        key={task.id}
                        className={`p-3 border rounded-lg flex flex-col items-center text-center ${
                          isCompleted
                            ? "bg-green-50 border-green-200"
                            : isActive
                            ? isQrCodeTask
                              ? "bg-emerald-50 border-emerald-300 border-2 shadow"
                              : "bg-blue-50 border-blue-300 border-2 shadow"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="mb-1">
                          {isCompleted ? (
                            <CheckCircle
                              className={`w-6 h-6 ${
                                isQrCodeTask
                                  ? "text-emerald-500"
                                  : "text-green-500"
                              }`}
                            />
                          ) : isActive ? (
                            <AlertCircle
                              className={`w-6 h-6 ${
                                isQrCodeTask
                                  ? "text-emerald-500"
                                  : "text-blue-500"
                              } animate-pulse`}
                            />
                          ) : (
                            <task.icon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="font-medium text-sm mb-1">
                          {task.name}
                        </div>

                        {/* Action buttons and status badges container - consistent height */}
                        <div className="w-full mt-auto flex flex-col justify-end min-h-[32px]">
                          {/* Liturgy Maker tasks */}
                          {(task.id === "concept" ||
                            task.id === "sermon" ||
                            task.id === "final") && (
                            <>
                              {/* For Pastor - show sermon creation button */}
                              {task.id === "sermon" &&
                                hasRole("pastor") &&
                                !isCompleted && (
                                  <Button
                                    size="sm"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-7"
                                    onClick={() => handleActionStart(task.id)}
                                  >
                                    {task.actionLabel}
                                  </Button>
                                )}

                              {/* For Liturgy Maker - show action button */}
                              {(task.id === "concept" || task.id === "final") &&
                                hasRole("liturgy") &&
                                !isCompleted && (
                                  <Button
                                    size="sm"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-7"
                                    onClick={() => handleActionStart(task.id)}
                                  >
                                    {task.actionLabel}
                                  </Button>
                                )}

                              {/* For Liturgy Maker - if completed, show download/view link */}
                              {isLiturgyMaker && isCompleted && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 text-xs py-1 h-7"
                                  onClick={() =>
                                    onStartAction &&
                                    onStartAction(`view-${task.id}`)
                                  }
                                >
                                  View Document
                                </Button>
                              )}

                              {/* For non-Liturgy Makers - if completed, show download/view link */}
                              {!isLiturgyMaker && isCompleted && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 text-xs py-1 h-7"
                                  onClick={() =>
                                    onStartAction &&
                                    onStartAction(`view-${task.id}`)
                                  }
                                >
                                  View Document
                                </Button>
                              )}
                            </>
                          )}

                          {/* QR Code special handling for Treasurer */}
                          {isQrCodeTask &&
                            ((typeof currentUserRole === "object" &&
                              (currentUserRole.id === "treasurer" ||
                                (currentUserRole.role &&
                                  currentUserRole.role.id === "treasurer"))) ||
                              currentUserRole === "treasurer") &&
                            !isCompleted && (
                              <Button
                                size="sm"
                                className={`w-full ${
                                  isActive
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : "bg-emerald-500 hover:bg-emerald-600"
                                } text-white text-xs py-1 h-7`}
                                onClick={() =>
                                  handleQrCodeAction(
                                    isActive ? "complete" : "upload"
                                  )
                                }
                              >
                                {isActive ? "Finish Upload" : task.actionLabel}
                              </Button>
                            )}

                          {/* Other tasks active handling */}
                          {!isQrCodeTask &&
                            !(
                              task.id === "concept" ||
                              task.id === "sermon" ||
                              task.id === "final"
                            ) &&
                            isActive &&
                            isCurrentUserCategory && (
                              <Button
                                size="sm"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-7"
                                onClick={() =>
                                  onStartAction && onStartAction(task.id)
                                }
                              >
                                {task.actionLabel}
                              </Button>
                            )}

                          {/* Consistent status badges */}
                          {!isActive && !isCompleted && (
                            <Badge
                              variant="secondary"
                              className="w-full mx-auto text-xs px-2 py-1 h-7 flex items-center justify-center bg-gray-100 text-gray-700 border border-gray-200"
                            >
                              Pending
                            </Badge>
                          )}

                          {isActive &&
                            !isCompleted &&
                            !isQrCodeTask &&
                            !hasRole(task.restrictedTo) && (
                              <Badge className="w-full mx-auto text-xs px-2 py-1 h-7 flex items-center justify-center bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
                                In Progress
                              </Badge>
                            )}

                          {isCompleted && (
                            <Badge className="w-full mx-auto text-xs px-2 py-1 h-7 flex items-center justify-center bg-green-500 text-white">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Document Creator Modal */}
      <DocumentCreatorModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSubmit={handleDocumentSubmit}
        documentType={currentDocumentType}
      />

      {/* Sermon Creator Modal */}
      <SermonCreatorModal
        isOpen={isSermonModalOpen}
        onClose={() => setIsSermonModalOpen(false)}
        onSubmit={handleSermonSubmit}
      />
    </div>
  );
}
