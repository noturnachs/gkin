// src/components/workflow/components/DemoPanel.jsx
import { Button } from "../../ui/button";
import { useWorkflow } from "../context/WorkflowContext";
import { useWorkflowHandlers } from "../hooks/useWorkflowHandlers";

export const DemoPanel = () => {
  const { hasRole, completedTasks } = useWorkflow();
  const {
    simulateSermonCreation,
    resetSermonStatus,
    handleActionStart,
    handleUploadSermon,
    handleUploadSlides,
  } = useWorkflowHandlers();

  return (
    <>
      {/* Translation team demo panel */}
      {hasRole("translation") && !completedTasks?.sermon && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-yellow-700 mb-2 text-sm">
            Demo Mode: No sermon is available yet. Click the button below to
            simulate sermon creation.
          </p>
          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={simulateSermonCreation}
          >
            Simulate Sermon Creation (Demo)
          </Button>
        </div>
      )}

      {/* Pastor demo panel */}
      {hasRole("pastor") && (
        <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
          <p className="text-purple-700 mb-2 text-sm">
            Pastor Demo Mode:{" "}
            {completedTasks?.sermon === "completed"
              ? "A sermon is already created. Reset to test sermon creation again."
              : "You can create or upload a sermon for the service."}
          </p>
          <div className="flex flex-wrap gap-2">
            {completedTasks?.sermon === "completed" ? (
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={resetSermonStatus}
              >
                Reset Sermon Status (Demo)
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => handleActionStart("sermon")}
                >
                  Create Sermon
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => handleUploadSermon("sermon")}
                >
                  Upload Sermon
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Beamer team demo panel */}
      {hasRole("beamer") && (
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
          <p className="text-orange-700 mb-2 text-sm">
            Beamer Team: You can upload presentation slides for the service.
          </p>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleUploadSlides}
          >
            Upload Presentation Slides
          </Button>
        </div>
      )}
    </>
  );
};
