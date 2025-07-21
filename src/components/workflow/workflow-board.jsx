import { useEffect } from "react";
import { WorkflowProvider } from "./context/WorkflowContext";
import { workflowCategories } from "./constants/workflow-categories";
import { CategorySection } from "./components/CategorySection";
import { DemoPanel } from "./components/DemoPanel";
import { ModalManager } from "./components/ModalManager";

export function WorkflowBoard({ service, currentUserRole, onStartAction }) {
  // Log role information for debugging
  useEffect(() => {
    console.log("Current user role:", currentUserRole);
    console.log(
      "Is treasurer check:",
      typeof currentUserRole === "object" && currentUserRole.role
        ? currentUserRole.role.id.toLowerCase() === "treasurer"
        : typeof currentUserRole === "object" && currentUserRole.id
        ? currentUserRole.id.toLowerCase() === "treasurer"
        : currentUserRole?.toLowerCase() === "treasurer"
    );
  }, [currentUserRole]);

  return (
    <WorkflowProvider
      service={service}
      currentUserRole={currentUserRole}
      onStartAction={onStartAction}
    >
      <div className="space-y-3 md:space-y-4">
        {/* Demo panels for different roles */}
        <DemoPanel />

        {/* Workflow categories */}
        {workflowCategories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}

        {/* All modals */}
        <ModalManager />
      </div>
    </WorkflowProvider>
  );
}
