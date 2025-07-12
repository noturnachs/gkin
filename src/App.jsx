import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import {
  Calendar,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Edit,
  Clock,
  MessageCircle,
} from "lucide-react";
import { WorkflowBoard } from "./components/workflow-board";
import { WeekSelector } from "./components/week-selector";
import { NotificationCenter } from "./components/notification-center";
import { GlobalChat } from "./components/global-chat";
import { ServiceAssignments } from "./components/service-assignments";
import { LoginPage } from "./components/login-page";
import { WelcomeBanner } from "./components/welcome-banner";
import { DocumentCreator } from "./components/document-creator";
import { Footer } from "./components/ui/footer";
import { Header } from "./components/header";
import {
  generateServiceData,
  getDefaultSelectedWeek,
  getUpcomingSundays,
  formatDate,
  getStatusColor,
} from "./lib/date-utils";
import { RecentUpdates } from "./components/recent-updates";

const roles = [
  { id: "liturgy", name: "Liturgy Maker", color: "bg-blue-500" },
  { id: "pastor", name: "Pastor", color: "bg-purple-500" },
  { id: "translation", name: "Translation", color: "bg-green-500" },
  { id: "beamer", name: "Beamer Team", color: "bg-orange-500" },
  { id: "music", name: "Music Team", color: "bg-pink-500" },
];

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [selectedWeek, setSelectedWeek] = useState(getDefaultSelectedWeek());
  const [showChat, setShowChat] = useState(true); // Change from false to true
  const [showDocumentCreator, setShowDocumentCreator] = useState(false);
  const [welcomeBannerDismissed, setWelcomeBannerDismissed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mockServices, setMockServices] = useState(generateServiceData());

  // Initialize services using the shared date utility
  useEffect(() => {
    const sundays = getUpcomingSundays(4);

    const services = sundays.map((sunday, index) => ({
      id: index + 1,
      date: sunday.dateString,
      title: `Sunday Service - ${sunday.title}`,
      status: index === 0 ? "in-progress" : "pending",
      currentStep: index === 0 ? 1 : 0,
      totalSteps: 7,
      assignedTo: "liturgy",
      documents: [], // Start with empty documents
    }));

    setMockServices(services);

    // Set the initial selected week to the first Sunday
    if (services.length > 0) {
      setSelectedWeek(services[0].date);
    }
  }, []);

  // Find the current service based on the selected week
  // This needs to be more robust to handle date mismatches
  const currentService = useMemo(() => {
    if (!selectedWeek || mockServices.length === 0) return null;

    // Try direct match first
    let service = mockServices.find((s) => s.date === selectedWeek);

    // If no direct match, find the closest date
    if (!service) {
      const selectedDateTime = new Date(selectedWeek).getTime();

      service = mockServices.reduce((closest, current) => {
        const currentTime = new Date(current.date).getTime();
        const closestTime = closest
          ? new Date(closest.date).getTime()
          : Infinity;

        const currentDiff = Math.abs(currentTime - selectedDateTime);
        const closestDiff = Math.abs(closestTime - selectedDateTime);

        return currentDiff < closestDiff ? current : closest;
      }, null);
    }

    return service;
  }, [selectedWeek, mockServices]);

  // Handle user login with localStorage
  const handleLogin = (userData) => {
    // Save user to state and localStorage
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    // setSelectedRole(userData.role.id); // Removed as per edit hint
  };

  // Handle logout with localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    // Redirect to login page
    navigate("/login");
  };

  // If user is null, redirect to login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // If no user is logged in, don't render the main app
  if (!user) {
    return null; // Return null while redirecting
  }

  // Handle starting an action
  const handleStartAction = (stepId) => {
    if (stepId === 1) {
      navigate("/create-document");
    }
    // Handle other step actions as needed
  };

  // Handle document creation completion
  const handleDocumentComplete = (documentData) => {
    setShowDocumentCreator(false);

    if (documentData) {
      // Update the current service with the new document
      const updatedServices = mockServices.map((service) => {
        if (service.date === selectedWeek) {
          return {
            ...service,
            documents: [
              ...service.documents,
              {
                id: Date.now(),
                name: documentData.title,
                link: documentData.link,
                status: "in-progress",
                lastModified: new Date().toLocaleDateString(),
                type: "concept",
              },
            ],
            currentStep: 2, // Move to next step (Pastor Review)
            assignedTo: "pastor", // Assign to pastor for review
          };
        }
        return service;
      });

      // In a real app, you would update your state through proper state management
      // For this mockup, we're directly modifying the mockServices array
      setMockServices(updatedServices);

      // Show success message
      alert(
        "Document created successfully! Pastor has been notified for review."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <Header
          title="Liturgy Workflow"
          subtitle="Manage document workflow for weekly services"
          user={user}
          onLogout={handleLogout}
          showGoogleDrive={true}
          showNotifications={true}
          showUserInfo={true}
          showLogout={true}
        />

        {/* Week Selector - Responsive */}
        <div className="overflow-x-auto">
          <WeekSelector
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />
        </div>

        {/* Welcome Banner - for first-time users */}
        {!welcomeBannerDismissed &&
          user.role.id === "liturgy" &&
          currentService?.currentStep === 1 && (
            <WelcomeBanner
              userName={user.username}
              roleName={user.role.name}
              onStartAction={handleStartAction}
              onDismiss={() => setWelcomeBannerDismissed(true)}
            />
          )}

        {/* Mobile Chat - Always visible */}
        <div className="md:hidden">
          <GlobalChat />
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Service Assignments and Workflow Board */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Service Assignments - At top */}
            <ServiceAssignments selectedDate={selectedWeek} />

            {/* Workflow Board - Below Service Assignments */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">
                  Workflow Progress
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Track document progress through all stages
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <WorkflowBoard
                  service={currentService}
                  currentUserRole={user.role.id}
                  onStartAction={handleStartAction}
                />
              </CardContent>
            </Card>

            {/* Service Details */}
            {currentService && (
              <Card className="overflow-hidden border border-gray-200 shadow-sm">
                <CardHeader className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 md:p-2.5 bg-blue-50 rounded-full border border-blue-100">
                        <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg md:text-xl text-gray-900">
                          {currentService.title}
                        </CardTitle>
                        <CardDescription className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
                          Service date:{" "}
                          <span className="inline-block">
                            {new Date(currentService.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs mt-1 sm:mt-0 self-start sm:self-auto ${
                        currentService.status === "in-progress"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {currentService.status === "in-progress"
                        ? "In Progress"
                        : "Completed"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Progress Section */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900">
                          Workflow Progress
                        </h4>
                        <div className="text-base sm:text-lg font-bold text-blue-700">
                          {Math.round(
                            (currentService.currentStep /
                              currentService.totalSteps) *
                              100
                          )}
                          %
                        </div>
                      </div>

                      <div className="mb-3 sm:mb-4">
                        <Progress
                          value={
                            (currentService.currentStep /
                              currentService.totalSteps) *
                            100
                          }
                          className="h-2 sm:h-2.5 bg-gray-100"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-[10px] sm:text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600"></div>
                          <span>
                            Step {currentService.currentStep} of{" "}
                            {currentService.totalSteps}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="font-medium">Current phase:</span>{" "}
                          <span>
                            {currentService.currentStep === 1
                              ? "Concept Creation"
                              : currentService.currentStep === 2
                              ? "Pastor Review"
                              : currentService.currentStep === 3
                              ? "Document Update"
                              : currentService.currentStep === 4
                              ? "Final Version"
                              : currentService.currentStep === 5
                              ? "Translation"
                              : currentService.currentStep === 6
                              ? "Presentation"
                              : "Complete"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Documents Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 flex items-center gap-1.5 sm:gap-2">
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                          Documents
                        </h4>
                        {currentService.documents.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2 border-gray-200 text-gray-700"
                          >
                            View All
                          </Button>
                        )}
                      </div>

                      {currentService.documents.length > 0 ? (
                        <div className="space-y-2">
                          {currentService.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <div
                                  className={`p-1.5 sm:p-2 rounded-md ${
                                    doc.type === "concept"
                                      ? "bg-blue-50"
                                      : doc.type === "pastor"
                                      ? "bg-purple-50"
                                      : doc.type === "beamer"
                                      ? "bg-orange-50"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <FileText
                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                      doc.type === "concept"
                                        ? "text-blue-600"
                                        : doc.type === "pastor"
                                        ? "text-purple-600"
                                        : doc.type === "beamer"
                                        ? "text-orange-600"
                                        : "text-gray-600"
                                    }`}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                                    {doc.name}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500 flex flex-wrap items-center gap-1 sm:gap-2">
                                    <span className="truncate max-w-[120px] sm:max-w-none">
                                      Last modified: {doc.lastModified}
                                    </span>
                                    {doc.link && (
                                      <a
                                        href={doc.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-0.5"
                                      >
                                        Open
                                        <svg
                                          className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        >
                                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                          <path d="M15 3h6v6"></path>
                                          <path d="M10 14L21 3"></path>
                                        </svg>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 ml-2">
                                <Badge
                                  className={`text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 ${
                                    doc.status === "completed"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : doc.status === "in-progress"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-gray-100 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {doc.status}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-full text-gray-500 hover:text-gray-700"
                                >
                                  <svg
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="19" cy="12" r="1"></circle>
                                    <circle cx="5" cy="12" r="1"></circle>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center">
                          <div className="p-2 sm:p-3 bg-gray-100 rounded-full mb-2 sm:mb-3">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                          </div>
                          <h4 className="text-sm sm:text-base text-gray-700 font-medium mb-1">
                            No documents yet
                          </h4>
                          <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                            Documents will appear here once they are created
                          </p>
                          {/* Only show create button for authorized roles */}
                          {((currentService.currentStep === 1 &&
                            user.role.id === "liturgy") ||
                            (currentService.currentStep === 2 &&
                              user.role.id === "pastor") ||
                            (currentService.currentStep === 6 &&
                              user.role.id === "beamer")) && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-8 sm:h-9"
                              onClick={() =>
                                handleStartAction(currentService.currentStep)
                              }
                            >
                              {user.role.id === "liturgy"
                                ? "Create Concept"
                                : user.role.id === "pastor"
                                ? "Upload Review"
                                : "Upload Presentation"}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Document Permissions Info */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4">
                      <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 16v-4"></path>
                          <path d="M12 8h.01"></path>
                        </svg>
                        Document Permissions
                      </h4>
                      <p className="text-[10px] sm:text-xs text-blue-700 mb-2 sm:mb-3">
                        Only specific roles can create or upload documents at
                        different workflow stages
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 sm:p-2 rounded border border-blue-200">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600"></div>
                          <span className="text-[10px] sm:text-xs text-gray-800">
                            <span className="font-medium">Liturgy Maker:</span>{" "}
                            Concept & Final
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 sm:p-2 rounded border border-blue-200">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-600"></div>
                          <span className="text-[10px] sm:text-xs text-gray-800">
                            <span className="font-medium">Pastor:</span> Review
                            Documents
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 sm:p-2 rounded border border-blue-200">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-600"></div>
                          <span className="text-[10px] sm:text-xs text-gray-800">
                            <span className="font-medium">Beamer:</span>{" "}
                            Presentations
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Team Members */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">
                        Assigned Team
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {[
                          "liturgy",
                          "pastor",
                          "translation",
                          "beamer",
                          "music",
                        ].map((role, index) => {
                          const isActive = currentService.assignedTo === role;
                          const canCreateDocs = [
                            "liturgy",
                            "pastor",
                            "beamer",
                          ].includes(role);
                          const roleColor = {
                            liturgy: {
                              bg: "bg-blue-50",
                              text: "text-blue-700",
                              border: "border-blue-200",
                            },
                            pastor: {
                              bg: "bg-purple-50",
                              text: "text-purple-700",
                              border: "border-purple-200",
                            },
                            translation: {
                              bg: "bg-green-50",
                              text: "text-green-700",
                              border: "border-green-200",
                            },
                            beamer: {
                              bg: "bg-orange-50",
                              text: "text-orange-700",
                              border: "border-orange-200",
                            },
                            music: {
                              bg: "bg-pink-50",
                              text: "text-pink-700",
                              border: "border-pink-200",
                            },
                          }[role];

                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border ${
                                isActive
                                  ? `${roleColor.bg} ${roleColor.text} ${roleColor.border}`
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                                  isActive
                                    ? roleColor.text.replace("text", "bg")
                                    : "bg-gray-400"
                                }`}
                              ></div>
                              <span className="text-[10px] sm:text-xs font-medium capitalize">
                                {role}
                              </span>
                              {isActive && (
                                <span className="text-[9px] sm:text-[10px]">
                                  (Current)
                                </span>
                              )}
                              {canCreateDocs && (
                                <svg
                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M12 5v14"></path>
                                  <path d="M5 12h14"></path>
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-xs text-gray-500 flex items-center gap-1">
                        <svg
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 5v14"></path>
                          <path d="M5 12h14"></path>
                        </svg>
                        <span>
                          Indicates roles that can create/upload documents
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Global Chat and Role Actions */}
          <div className="space-y-4 md:space-y-6">
            {/* Global Chat - Now at the top of right column (hidden on mobile) */}
            <div className="hidden md:block">
              <GlobalChat />
            </div>

            {/* Recent Updates - Replacing Notifications */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">
                  Recent Updates
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Latest activity and workflow changes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <RecentUpdates limit={4} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Metrics Cards - Moved to the bottom */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Service Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Active Services
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Services in workflow
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Pending Actions
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Actions requiring attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Active team roles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">75%</div>
                <p className="text-xs text-muted-foreground">
                  This week's progress
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer component */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
