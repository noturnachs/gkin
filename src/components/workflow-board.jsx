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
  Mail,
  Music,
  Presentation,
  Upload,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { DocumentCreatorModal } from "./document-creator-modal";
import { SermonCreatorModal } from "./sermon-creator-modal";
import { SendToPastorModal } from "./send-to-pastor-modal"; // We'll create this new component
import { SendToMusicModal } from "./send-to-music-modal"; // We'll create this new component
import { SermonUploadModal } from "./sermon-upload-modal"; // Import the new modal
import { PastorNotifyModal } from "./pastor-notify-modal"; // Import the pastor notify modal
import { LyricsInputModal } from "./lyrics-input-modal";
import { TranslationModal } from "./translation-modal";
import { SermonTranslationModal } from "./sermon-translation-modal";
import { SlidesUploadModal } from "./slides-upload-modal";
import { QrCodeUploadModal } from "./qr-code-upload-modal";

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
        name: "Translate Lyrics",
        icon: MessageSquare,
        description: "Translate song lyrics content",
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
        icon: Presentation,
        description: "Create presentation slides",
        actionLabel: "Create Slides",
      },
    ],
  },
];

export function WorkflowBoard({ service, currentUserRole, onStartAction }) {
  // Remove the expandedCategories state
  // const [expandedCategories, setExpandedCategories] = useState({
  //   liturgy: true, // Open by default
  //   translation: false,
  //   beamer: false,
  // });

  // Local state to track QR code upload status for simulation
  const [qrCodeStatus, setQrCodeStatus] = useState(
    service?.taskStatuses?.qrcode || "pending"
  );

  // Add these states for document tracking
  const [completedTasks, setCompletedTasks] = useState({
    // Demo data for testing - comment out for production
    sermon: "completed",
    sermonData: {
      sermonTitle: "Demo Sermon for Testing",
      sermonText:
        "This is a sample sermon text for testing the translation functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      serviceDate: "2023-07-23",
      documentType: "sermon",
      documentTitle: "Sunday Service - Demo Sermon",
    },
    // End of demo data
    ...service?.taskStatuses,
  });

  // Add these states for both modals
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isSermonModalOpen, setIsSermonModalOpen] = useState(false);
  const [currentDocumentType, setCurrentDocumentType] = useState("concept");

  // Add state for the send to pastor modal
  const [isSendToPastorModalOpen, setIsSendToPastorModalOpen] = useState(false);
  const [currentDocumentToSend, setCurrentDocumentToSend] = useState(null);

  // Add state for the send to music modal
  const [isSendToMusicModalOpen, setIsSendToMusicModalOpen] = useState(false);
  const [currentDocumentToSendMusic, setCurrentDocumentToSendMusic] =
    useState(null);

  // Add a new state for the sermon upload modal
  const [isSermonUploadModalOpen, setIsSermonUploadModalOpen] = useState(false);

  // Add a new state for the pastor notification modal
  const [isPastorNotifyModalOpen, setIsPastorNotifyModalOpen] = useState(false);
  const [currentDocumentToNotify, setCurrentDocumentToNotify] = useState(null);

  // Add these new state variables with your other states
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState(false);
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState(null);

  // Add state variables for the sermon translation modal
  const [isSermonTranslationModalOpen, setIsSermonTranslationModalOpen] =
    useState(false);
  const [currentSermon, setCurrentSermon] = useState(null);

  // Add state variables for the slides upload modal
  const [isSlidesUploadModalOpen, setIsSlidesUploadModalOpen] = useState(false);

  // Add a new state for the QR code upload modal
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);

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

  // Remove the toggleCategory function
  // const toggleCategory = (categoryId) => {
  //   setExpandedCategories((prev) => ({
  //     ...prev,
  //     [categoryId]: !prev[categoryId],
  //   }));
  // };

  // Update the getTaskStatus function to use our local state
  const getTaskStatus = (taskId) => {
    // Special handling for qrcode task to use local state
    if (taskId === "qrcode") {
      return qrCodeStatus;
    }

    // Check our local completedTasks state first
    if (completedTasks && completedTasks[taskId]) {
      return completedTasks[taskId];
    }

    // Fall back to service data if available
    if (service && service.taskStatuses) {
      return service.taskStatuses[taskId] || "pending";
    }

    return "pending";
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
      // Open the QR code upload modal instead of directly changing status
      setIsQrCodeModalOpen(true);
    } else {
      onStartAction && onStartAction("qrcode");
    }
  };

  // This function will handle sermon submission from the modal
  const handleSermonSubmit = (sermonData) => {
    // Here you would handle the saved sermon
    console.log("Sermon submitted:", sermonData);

    // Update the local completed tasks state
    setCompletedTasks((prev) => ({
      ...prev,
      sermon: "completed",
      // Store the actual sermon data if needed
      sermonData: sermonData,
    }));

    // Close the sermon modal
    setIsSermonModalOpen(false);

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

    // Update the local completed tasks state
    setCompletedTasks((prev) => ({
      ...prev,
      [documentData.documentType]: "completed",
      // Store the actual document data if needed
      [`${documentData.documentType}Data`]: documentData,
    }));

    // Close the document modal
    setIsDocumentModalOpen(false);

    // Update the service status for this task if needed
    if (onStartAction) {
      onStartAction(`${documentData.documentType}-completed`);
    }

    // Show a success message
    alert(`${documentData.documentTitle} has been saved successfully!`);
  };

  // Handle sending document to pastor
  const handleSendToPastor = (taskId) => {
    console.log(`Preparing to send document: ${taskId} to pastor`);
    setCurrentDocumentToSend(taskId);
    setIsSendToPastorModalOpen(true);
  };

  // Handle submission from send to pastor modal
  const handleSendToPastorSubmit = (emailData) => {
    console.log("Sending document to pastor:", emailData);

    // Here you would typically make an API call to send the email

    // Show success message
    alert(`Document sent to ${emailData.email}!`);

    // Close the modal
    setIsSendToPastorModalOpen(false);

    // Update the status if needed
    if (onStartAction) {
      onStartAction(`${currentDocumentToSend}-sent-to-pastor`);
    }
  };

  // Handle sending document to music team
  const handleSendToMusic = (taskId) => {
    console.log(`Preparing to send document: ${taskId} to music team`);
    setCurrentDocumentToSendMusic(taskId);
    setIsSendToMusicModalOpen(true);
  };

  // Handle submission from send to music modal
  const handleSendToMusicSubmit = (emailData) => {
    console.log("Sending document to music team:", emailData);

    // Here you would typically make an API call to send the email

    // Show success message
    alert(`Document sent to music team at ${emailData.email}!`);

    // Close the modal
    setIsSendToMusicModalOpen(false);

    // Update the status if needed
    if (onStartAction) {
      onStartAction(`${currentDocumentToSendMusic}-sent-to-music`);
    }
  };

  // Add this function after your other handler functions
  const handleUploadSermon = (taskId) => {
    console.log(`Upload sermon for task: ${taskId}`);
    setIsSermonUploadModalOpen(true);
  };

  // Add this handler for sermon upload submission
  const handleSermonUploadSubmit = (sermonData) => {
    console.log("Sermon upload submitted:", sermonData);

    // Update the local completed tasks state
    setCompletedTasks((prev) => ({
      ...prev,
      sermon: "completed",
      // Store the actual sermon data
      sermonData: sermonData,
    }));

    // Close the upload modal
    setIsSermonUploadModalOpen(false);

    // Update the service status for this task if needed
    if (onStartAction) {
      onStartAction(`sermon-uploaded`);
    }

    // Show a success message
    alert(`Sermon "${sermonData.sermonTitle}" has been uploaded successfully!`);
  };

  // Update your handleActionStart function to remove role restrictions
  const handleActionStart = (taskId) => {
    console.log(`Action started for task: ${taskId}`);

    // For sermon task, open the sermon modal (for anyone)
    if (taskId === "sermon") {
      setIsSermonModalOpen(true);
    }
    // For document creation tasks, open the document modal (for anyone)
    else if (taskId === "concept" || taskId === "final") {
      setCurrentDocumentType(taskId);
      setIsDocumentModalOpen(true);
    } else {
      // For other actions, use the original handler
      onStartAction && onStartAction(taskId);
    }
  };

  // Handle document viewing
  const handleViewDocument = (taskId) => {
    console.log(`Viewing document: ${taskId}`);

    // Define example document URLs for each document type
    const documentLinks = {
      concept:
        "https://docs.google.com/document/d/1example-concept-document/edit",
      sermon:
        "https://docs.google.com/document/d/1example-sermon-document/edit",
      final: "https://docs.google.com/document/d/1example-final-document/edit",
      qrcode: "https://example.com/qr-code-image.png",
      slides: "https://example.com/presentation.pptx", // Example for slides
    };

    // Get the document name for the alert
    const documentTypes = {
      concept: "Concept Document",
      final: "Final Liturgy",
      sermon: "Sermon",
      qrcode: "QR Code",
      slides: "Presentation Slides",
    };

    // Get the document URL
    const documentUrl = documentLinks[taskId];

    if (documentUrl) {
      // Open the document in a new tab
      window.open(documentUrl, "_blank");
      alert(`Opening ${documentTypes[taskId] || taskId} in a new tab`);
    } else {
      // Fallback to just showing an alert
      alert(`Opening ${documentTypes[taskId] || taskId} for viewing`);
    }

    // If you need to call the parent handler
    onStartAction && onStartAction(`view-${taskId}`);
  };

  // Handle pastor editing document
  const handlePastorEdit = (taskId) => {
    console.log(`Pastor editing document: ${taskId}`);

    // Define document URLs - same as in handleViewDocument
    const documentLinks = {
      concept:
        "https://docs.google.com/document/d/1example-concept-document/edit",
      sermon:
        "https://docs.google.com/document/d/1example-sermon-document/edit",
      final: "https://docs.google.com/document/d/1example-final-document/edit",
      qrcode: "https://example.com/qr-code-image.png",
      slides: "https://example.com/presentation.pptx", // Example for slides
    };

    // Get document types
    const documentTypes = {
      concept: "Concept Document",
      final: "Final Liturgy",
      sermon: "Sermon",
      qrcode: "QR Code",
      slides: "Presentation Slides",
    };

    // Get the document URL
    const documentUrl = documentLinks[taskId];

    if (documentUrl) {
      // Open the document in a new tab
      window.open(documentUrl, "_blank");

      // Show a confirmation when window is refocused that they can notify teams when done
      window.addEventListener(
        "focus",
        function onFocus() {
          // Remove this listener so it only runs once
          window.removeEventListener("focus", onFocus);

          // Ask if they want to notify teams now
          const confirmed = window.confirm(
            `Have you finished editing the ${documentTypes[taskId]}? Would you like to notify the teams now?`
          );

          if (confirmed) {
            handlePastorNotifyTeams(taskId);
          }
        },
        { once: true }
      );
    }
  };

  // Handle pastor notifying teams after editing
  const handlePastorNotifyTeams = (taskId) => {
    console.log(`Pastor notifying teams about document: ${taskId}`);
    setCurrentDocumentToNotify(taskId);
    setIsPastorNotifyModalOpen(true);
  };

  // Handle submission from pastor notify modal
  const handlePastorNotifySubmit = (notificationData) => {
    console.log("Pastor sending notifications:", notificationData);

    // Here you would typically make an API call to send the emails

    // Show success message
    alert(
      `Notifications sent to teams about the ${notificationData.documentType}!`
    );

    // Close the modal
    setIsPastorNotifyModalOpen(false);

    // Update the status if needed
    if (onStartAction) {
      onStartAction(`${currentDocumentToNotify}-pastor-reviewed`);
    }
  };

  // Add these handler functions for lyrics and translations
  const handleAddLyrics = () => {
    console.log("Opening lyrics input modal");
    setIsLyricsModalOpen(true);
  };

  const handleLyricsSubmit = (lyricsData) => {
    console.log("Lyrics submitted:", lyricsData);

    // Update the local state to store the lyrics
    setCompletedTasks((prev) => ({
      ...prev,
      lyrics: "completed",
      lyricsData: lyricsData,
    }));

    // Close the modal
    setIsLyricsModalOpen(false);

    // Update the service status if needed
    if (onStartAction) {
      onStartAction("lyrics-added");
    }

    // Show a success message
    alert("Song lyrics have been saved successfully!");
  };

  const handleTranslateLyrics = () => {
    console.log("Opening translation modal");
    // Get the current lyrics data from the completedTasks
    const lyricsData = completedTasks?.lyricsData || { songs: [] };
    setCurrentLyrics(lyricsData);
    setIsTranslationModalOpen(true);
  };

  const handleTranslationSubmit = (translationData) => {
    console.log("Translation submitted:", translationData);

    // Update the local state to store the translations
    setCompletedTasks((prev) => ({
      ...prev,
      "translate-liturgy": "completed",
      translationData: translationData,
    }));

    // Close the modal
    setIsTranslationModalOpen(false);

    // Update the service status if needed
    if (onStartAction) {
      onStartAction("lyrics-translated");
    }

    // Show a success message
    alert("Translations have been saved successfully!");
  };

  // Add this handler function for sermon translation
  const handleTranslateSermon = () => {
    console.log("Opening sermon translation modal");
    // Get the current sermon data from the completedTasks
    const sermonData = completedTasks?.sermonData || null;
    setCurrentSermon(sermonData);
    setIsSermonTranslationModalOpen(true);
  };

  // Add this handler for sermon translation submission
  const handleSermonTranslationSubmit = (translationData) => {
    console.log("Sermon translation submitted:", translationData);

    // Update the local state to store the translations
    setCompletedTasks((prev) => ({
      ...prev,
      "translate-sermon": "completed",
      sermonTranslationData: translationData,
    }));

    // Close the modal
    setIsSermonTranslationModalOpen(false);

    // Update the service status if needed
    if (onStartAction) {
      onStartAction("sermon-translated");
    }

    // Show a success message
    alert("Sermon translation has been saved successfully!");
  };

  // Helper function to log role information for debugging
  useEffect(() => {
    console.log("Current user role:", currentUserRole);
    console.log("Is treasurer check:", isTreasurer);
  }, [currentUserRole, isTreasurer]);

  // FOR DEMO ONLY: Add a function to simulate sermon creation
  const simulateSermonCreation = () => {
    setCompletedTasks((prev) => ({
      ...prev,
      sermon: "completed",
      sermonData: {
        sermonTitle: "Demo Sermon for Testing",
        sermonText:
          "This is a sample sermon text for testing the translation functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        serviceDate: "2023-07-23",
        documentType: "sermon",
        documentTitle: "Sunday Service - Demo Sermon",
      },
    }));
    alert("Demo sermon created! Now translators can translate it.");
  };

  // FOR DEMO ONLY: Add a function to reset sermon status
  const resetSermonStatus = () => {
    setCompletedTasks((prev) => {
      const newState = { ...prev };
      delete newState.sermon;
      delete newState.sermonData;
      return newState;
    });
    alert("Sermon status has been reset for demo purposes.");
  };

  const handleUploadSlides = () => {
    console.log("Opening slides upload modal");
    setIsSlidesUploadModalOpen(true);
  };

  const handleSlidesUploadSubmit = (slidesData) => {
    console.log("Slides upload submitted:", slidesData);

    // Update the local state to store the slides data
    setCompletedTasks((prev) => ({
      ...prev,
      slides: "completed",
      slidesData: slidesData,
    }));

    // Close the modal
    setIsSlidesUploadModalOpen(false);

    // Update the service status if needed
    if (onStartAction) {
      onStartAction("slides-uploaded");
    }

    // Show a success message
    alert(`Presentation "${slidesData.title}" has been uploaded successfully!`);
  };

  // Add a handler for QR code upload submission
  const handleQrCodeUploadSubmit = (qrCodeData) => {
    console.log("QR code upload submitted:", qrCodeData);

    // Set the QR code status to active first
    setQrCodeStatus("active");

    // Then simulate processing and set to completed
    setTimeout(() => {
      setQrCodeStatus("completed");

      // Update the completed tasks state
      setCompletedTasks((prev) => ({
        ...prev,
        qrcode: "completed",
        qrcodeData: qrCodeData,
      }));

      // Close the modal
      setIsQrCodeModalOpen(false);

      // Update the service status if needed
      if (onStartAction) {
        onStartAction("qrcode-uploaded");
      }

      // Show a success message
      alert(`QR Code "${qrCodeData.title}" has been uploaded successfully!`);
    }, 1500); // Simulate a short processing time
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* DEMO BUTTONS - Remove in production */}
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

      {/* Add demo panel for pastors */}
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

      {workflowCategories.map((category) => {
        const isCurrentUserCategory = isUserCategory(category.role);
        // Remove the isCategoryExpanded variable
        // const isCategoryExpanded = expandedCategories[category.id];

        // Skip categories that don't match user's role if filtering is desired
        // if (!isCurrentUserCategory && currentUserRole !== "pastor") return null;

        return (
          <div
            key={category.id}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            {/* Category Header - non-collapsible now */}
            <div className={`flex items-center gap-3 p-3 ${category.color}`}>
              <category.icon className="w-5 h-5" />
              <div className="flex-1 font-medium">{category.name}</div>
              {/* Remove the chevron icons */}
            </div>

            {/* Subtasks - always visible */}
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
                      <div className="w-full mt-auto flex flex-col justify-end min-h-[32px] space-y-2">
                        {/* Liturgy Maker tasks */}
                        {(task.id === "concept" ||
                          task.id === "sermon" ||
                          task.id === "final") && (
                          <>
                            {/* Show sermon creation/upload options for everyone */}
                            {task.id === "sermon" && !isCompleted && (
                              <div className="space-y-2">
                                <Button
                                  size="sm"
                                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8 rounded-md"
                                  onClick={() => handleActionStart(task.id)}
                                >
                                  Create Sermon
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full border border-purple-300 text-purple-700 hover:bg-purple-50 text-xs py-1 h-8 rounded-md"
                                  onClick={() => handleUploadSermon(task.id)}
                                >
                                  Upload Sermon
                                </Button>
                              </div>
                            )}

                            {/* Show document creation buttons for everyone */}
                            {(task.id === "concept" || task.id === "final") &&
                              !isCompleted && (
                                <div className="space-y-2">
                                  <Button
                                    size="sm"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8 rounded-md"
                                    onClick={() => handleActionStart(task.id)}
                                  >
                                    {task.actionLabel}
                                  </Button>

                                  {/* Send to Pastor and Send to Music buttons - available for everyone */}
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

                            {/* Document viewing section - show for everyone when completed */}
                            {isCompleted && (
                              <div className="space-y-2">
                                {/* Skip this button for sermons when user is pastor (since we already added it above) */}
                                {!(
                                  task.id === "sermon" && hasRole("pastor")
                                ) && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className={`w-full ${
                                      isLiturgyMaker || isPastor
                                        ? "border border-blue-300 text-blue-700 hover:bg-blue-50"
                                        : "border border-gray-300 text-blue-600 hover:bg-gray-50"
                                    } text-xs py-1 h-8 rounded-md font-medium`}
                                    onClick={() => handleViewDocument(task.id)}
                                  >
                                    {task.id === "sermon"
                                      ? "View Sermon"
                                      : "View Document"}
                                  </Button>
                                )}

                                {/* Pastor special options - View & Edit and notify teams */}
                                {isPastor &&
                                  (task.id === "concept" ||
                                    task.id === "final") && (
                                    <div className="space-y-2 mt-2">
                                      <Button
                                        size="sm"
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 h-8 rounded-md flex items-center justify-center gap-1"
                                        onClick={() =>
                                          handlePastorEdit(task.id)
                                        }
                                      >
                                        <Edit className="w-3 h-3" />
                                        Edit Document
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 h-8 rounded-md flex items-center justify-center gap-1"
                                        onClick={() =>
                                          handlePastorNotifyTeams(task.id)
                                        }
                                      >
                                        <Mail className="w-3 h-3" />
                                        Notify Teams
                                      </Button>
                                    </div>
                                  )}

                                {/* Send to Pastor and Send to Music buttons for completed documents - REMOVE THIS SECTION */}
                                {/* We've moved these buttons outside the isCompleted condition */}
                              </div>
                            )}
                          </>
                        )}

                        {/* QR Code handling - available for everyone */}
                        {isQrCodeTask && !isCompleted && (
                          <Button
                            size="sm"
                            className={`w-full ${
                              isActive
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            } text-white text-xs py-1 h-8 rounded-md`}
                            onClick={() =>
                              handleQrCodeAction(
                                isActive ? "complete" : "upload"
                              )
                            }
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

                        {/* Lyrics translation task special handling */}
                        {task.id === "translate-liturgy" && (
                          <>
                            {/* Always show Add/Edit Song Lyrics button */}
                            <Button
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8 rounded-md"
                              onClick={handleAddLyrics}
                            >
                              {completedTasks?.lyrics === "completed"
                                ? "Edit Lyrics"
                                : "Add Song Lyrics"}
                            </Button>

                            {/* Show Translate button regardless of lyrics status */}
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

                        {/* Sermon translation task special handling */}
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

                        {/* Beamer slides task special handling */}
                        {task.id === "slides" && (
                          <>
                            {/* For beamer team - show upload button */}
                            {!isCompleted && (
                              <Button
                                size="sm"
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 h-8 rounded-md"
                                onClick={handleUploadSlides}
                              >
                                Upload Slides
                              </Button>
                            )}

                            {/* When completed, show view button */}
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
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-8 rounded-md"
                              onClick={() =>
                                onStartAction && onStartAction(task.id)
                              }
                            >
                              {task.actionLabel}
                            </Button>
                          )}

                        {/* Consistent status badges */}
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
                })}
              </div>
            </div>
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

      {/* Add the Send to Pastor Modal */}
      <SendToPastorModal
        isOpen={isSendToPastorModalOpen}
        onClose={() => setIsSendToPastorModalOpen(false)}
        onSubmit={handleSendToPastorSubmit}
        documentType={currentDocumentToSend}
      />

      {/* Add the Send to Music Modal */}
      <SendToMusicModal
        isOpen={isSendToMusicModalOpen}
        onClose={() => setIsSendToMusicModalOpen(false)}
        onSubmit={handleSendToMusicSubmit}
        documentType={currentDocumentToSendMusic}
      />

      {/* Add the Sermon Upload Modal */}
      <SermonUploadModal
        isOpen={isSermonUploadModalOpen}
        onClose={() => setIsSermonUploadModalOpen(false)}
        onSubmit={handleSermonUploadSubmit}
      />

      {/* Add the Pastor Notify Modal - new */}
      <PastorNotifyModal
        isOpen={isPastorNotifyModalOpen}
        onClose={() => setIsPastorNotifyModalOpen(false)}
        onSubmit={handlePastorNotifySubmit}
        documentType={currentDocumentToNotify}
      />

      {/* Lyrics Input Modal - new */}
      <LyricsInputModal
        isOpen={isLyricsModalOpen}
        onClose={() => setIsLyricsModalOpen(false)}
        onSubmit={handleLyricsSubmit}
        initialData={completedTasks?.lyricsData}
      />

      {/* Translation Modal - new */}
      <TranslationModal
        isOpen={isTranslationModalOpen}
        onClose={() => setIsTranslationModalOpen(false)}
        onSubmit={handleTranslationSubmit}
        lyricsData={currentLyrics}
      />

      {/* Sermon Translation Modal */}
      <SermonTranslationModal
        isOpen={isSermonTranslationModalOpen}
        onClose={() => setIsSermonTranslationModalOpen(false)}
        onSubmit={handleSermonTranslationSubmit}
        sermonData={currentSermon}
      />

      {/* Slides Upload Modal */}
      <SlidesUploadModal
        isOpen={isSlidesUploadModalOpen}
        onClose={() => setIsSlidesUploadModalOpen(false)}
        onSubmit={handleSlidesUploadSubmit}
      />

      {/* Add the QR Code Upload Modal */}
      <QrCodeUploadModal
        isOpen={isQrCodeModalOpen}
        onClose={() => setIsQrCodeModalOpen(false)}
        onSubmit={handleQrCodeUploadSubmit}
      />
    </div>
  );
}
