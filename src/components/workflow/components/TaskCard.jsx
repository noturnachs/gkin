// src/components/workflow/components/TaskCard.jsx
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { CheckCircle, AlertCircle, Mail, Music, Edit } from "lucide-react";
import { useWorkflow } from "../context/WorkflowContext";
import { useWorkflowHandlers } from "../hooks/useWorkflowHandlers";

export const TaskCard = ({ task, categoryId }) => {
  const { getTaskStatus, hasRole, completedTasks } = useWorkflow();
  const {
    handleActionStart,
    handleViewDocument,
    handleSendToPastor,
    handleSendToMusic,
    handlePastorEdit,
    handlePastorNotifyTeams,
    handleQrCodeAction,
    handleAddLyrics,
    handleTranslateLyrics,
    handleTranslateSermon,
    handleUploadSermon,
    handleUploadSlides,
  } = useWorkflowHandlers();

  const status = getTaskStatus(task.id);
  const isCompleted = status === "completed";
  const isActive = status === "active";

  // Special handling for QR code task
  const isQrCodeTask = task.id === "qrcode";

  return (
    <div
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
              isQrCodeTask ? "text-emerald-500" : "text-green-500"
            }`}
          />
        ) : isActive ? (
          <AlertCircle
            className={`w-6 h-6 ${
              isQrCodeTask ? "text-emerald-500" : "text-blue-500"
            } animate-pulse`}
          />
        ) : (
          <task.icon className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <div className="font-medium text-sm mb-1">{task.name}</div>

      {/* Action buttons and status badges container */}
      <div className="w-full mt-auto flex flex-col justify-end min-h-[32px] space-y-2">
        {/* Liturgy Maker tasks */}
        {(task.id === "concept" ||
          task.id === "sermon" ||
          task.id === "final") && (
          <>
            {/* Show sermon creation/upload options */}
            {task.id === "sermon" && !isCompleted && (
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8 rounded-md"
                  onClick={() => handleUploadSermon(task.id)}
                >
                  Upload Sermon
                </Button>
              </div>
            )}

            {/* Show document creation buttons */}
            {(task.id === "concept" || task.id === "final") && !isCompleted && (
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8 rounded-md"
                  onClick={() => handleActionStart(task.id)}
                >
                  {task.actionLabel}
                </Button>

                <Button
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8 rounded-md flex items-center justify-center gap-1"
                  onClick={() => handleSendToPastor(task.id)}
                >
                  <Mail className="w-3 h-3" />
                  Send to Pastor
                </Button>

                <Button
                  size="sm"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 h-8 rounded-md flex items-center justify-center gap-1"
                  onClick={() => handleSendToMusic(task.id)}
                >
                  <Music className="w-3 h-3" />
                  Send to Music
                </Button>
              </div>
            )}

            {/* Document viewing section */}
            {isCompleted && (
              <div className="space-y-2">
                {!(task.id === "sermon" && hasRole("pastor")) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border border-blue-300 text-blue-700 hover:bg-blue-50 text-xs py-1 h-8 rounded-md font-medium"
                    onClick={() => handleViewDocument(task.id)}
                  >
                    {task.id === "sermon" ? "View Sermon" : "View Document"}
                  </Button>
                )}

                {/* Pastor special options */}
                {hasRole("pastor") &&
                  (task.id === "concept" || task.id === "final") && (
                    <div className="space-y-2 mt-2">
                      <Button
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8 rounded-md flex items-center justify-center gap-1"
                        onClick={() => handlePastorEdit(task.id)}
                      >
                        <Edit className="w-3 h-3" />
                        Edit Document
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 h-8 rounded-md flex items-center justify-center gap-1"
                        onClick={() => handlePastorNotifyTeams(task.id)}
                      >
                        <Mail className="w-3 h-3" />
                        Notify Teams
                      </Button>
                    </div>
                  )}
              </div>
            )}
          </>
        )}

        {/* QR Code handling */}
        {isQrCodeTask && !isCompleted && (
          <Button
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8 rounded-md"
            onClick={() => handleQrCodeAction(isActive ? "complete" : "upload")}
          >
            {isActive ? "Finish Upload" : task.actionLabel}
          </Button>
        )}

        {/* QR Code viewing when completed */}
        {isQrCodeTask && isCompleted && (
          <Button
            size="sm"
            variant="outline"
            className="w-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs py-1 h-8 rounded-md font-medium"
            onClick={() => handleViewDocument("qrcode")}
          >
            View QR Code
          </Button>
        )}

        {/* Lyrics translation task */}
        {task.id === "translate-liturgy" && (
          <>
            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8 rounded-md"
              onClick={handleAddLyrics}
            >
              {completedTasks?.lyrics === "completed"
                ? "Edit Lyrics"
                : "Add Song Lyrics"}
            </Button>

            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8 rounded-md mt-2"
              onClick={handleTranslateLyrics}
              disabled={!completedTasks?.lyrics}
            >
              Translate Lyrics
            </Button>
          </>
        )}

        {/* Sermon translation task */}
        {task.id === "translate-sermon" &&
          completedTasks?.sermon === "completed" && (
            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8 rounded-md"
              onClick={handleTranslateSermon}
            >
              Translate Sermon
            </Button>
          )}

        {/* Beamer slides task */}
        {task.id === "slides" && (
          <>
            {!isCompleted && (
              <Button
                size="sm"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 h-8 rounded-md"
                onClick={handleUploadSlides}
              >
                Upload Slides
              </Button>
            )}

            {isCompleted && (
              <Button
                size="sm"
                variant="outline"
                className="w-full border border-orange-300 text-orange-700 hover:bg-orange-50 text-xs py-1 h-8 rounded-md font-medium"
                onClick={() => handleViewDocument("slides")}
              >
                View Slides
              </Button>
            )}
          </>
        )}

        {/* Status badges */}
        {!isActive &&
          !isCompleted &&
          !(
            task.id === "translate-liturgy" &&
            ((hasRole("liturgy") && !completedTasks?.lyrics) ||
              (hasRole("translation") &&
                completedTasks?.lyrics === "completed"))
          ) && (
            <Badge
              variant="secondary"
              className="w-full mx-auto text-xs px-2 py-1 h-8 flex items-center justify-center bg-gray-100 text-gray-700 border border-gray-200 rounded-md"
            >
              Pending
            </Badge>
          )}

        {isActive &&
          !isCompleted &&
          !isQrCodeTask &&
          !hasRole(task.restrictedTo) && (
            <Badge className="w-full mx-auto text-xs px-2 py-1 h-8 flex items-center justify-center bg-blue-100 text-blue-800 border border-blue-300 rounded-md animate-pulse">
              In Progress
            </Badge>
          )}

        {isCompleted && (
          <Badge className="w-full mx-auto text-xs px-2 py-1 h-8 flex items-center justify-center bg-green-500 text-white rounded-md font-medium">
            Completed
          </Badge>
        )}
      </div>
    </div>
  );
};
