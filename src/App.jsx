import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Calendar, FileText, Users, CheckCircle, AlertCircle } from "lucide-react";
import { WorkflowBoard } from "./components/workflow-board";
import { WeekSelector } from "./components/week-selector";
import { ActionPanel } from "./components/action-panel";
import { NotificationCenter } from "./components/notification-center";
import { GlobalChat } from "./components/global-chat";
import { ServiceAssignments } from "./components/service-assignments";
import { LoginPage } from "./components/login-page";

const roles = [
  { id: "liturgy", name: "Liturgy Maker", color: "bg-blue-500" },
  { id: "pastor", name: "Pastor", color: "bg-purple-500" },
  { id: "translation", name: "Translation", color: "bg-green-500" },
  { id: "beamer", name: "Beamer Team", color: "bg-orange-500" },
  { id: "music", name: "Music Team", color: "bg-pink-500" },
];

const mockServices = [
  {
    id: 1,
    date: "2024-01-07",
    title: "Sunday Service - January 7",
    status: "in-progress",
    currentStep: 3,
    totalSteps: 7,
    assignedTo: "translation",
    documents: [
      { name: "Liturgy Concept", status: "completed", lastModified: "2024-01-05" },
      { name: "Pastor Review", status: "completed", lastModified: "2024-01-06" },
      { name: "Final Liturgy", status: "in-progress", lastModified: "2024-01-07" },
    ],
  },
  {
    id: 2,
    date: "2024-01-14",
    title: "Sunday Service - January 14",
    status: "pending",
    currentStep: 1,
    totalSteps: 7,
    assignedTo: "liturgy",
    documents: [{ name: "Liturgy Concept", status: "draft", lastModified: "2024-01-07" }],
  },
];

function App() {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("liturgy");
  const [selectedWeek, setSelectedWeek] = useState("2024-01-07");
  const [showChat, setShowChat] = useState(false);

  const currentService = mockServices.find((s) => s.date === selectedWeek);

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    setSelectedRole(userData.role.id);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
  };

  // If no user is logged in, show the login page
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header - Responsive with user info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Liturgy Workflow</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage document workflow for weekly services</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-300 text-sm">
              <div className={`w-2 h-2 rounded-full ${user.role.color}`}></div>
              <span className="font-medium text-gray-800">{user.username}</span>
              <span className="text-gray-500">({user.role.name})</span>
            </div>
            <NotificationCenter />
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white text-sm md:text-base"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">Google Drive</span>
            </Button>
            <Button
              variant="outline"
              className="bg-white text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              variant="outline"
              className="md:hidden flex items-center gap-2 bg-white"
              onClick={() => setShowChat(!showChat)}
            >
              <span>{showChat ? "Hide Chat" : "Show Chat"}</span>
            </Button>
          </div>
        </div>

        {/* Week Selector - Responsive */}
        <div className="overflow-x-auto">
          <WeekSelector selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
        </div>

        {/* Overview Cards - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Active Services</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Services in workflow</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Pending Actions</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Actions requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Active team roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">This week's progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Chat Toggle */}
        {showChat && (
          <div className="md:hidden mb-4">
            <GlobalChat />
          </div>
        )}

        {/* Main Content - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Service Assignments and Workflow Board */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Service Assignments - At top */}
            <ServiceAssignments selectedDate={selectedWeek} />
            
            {/* Workflow Board - Below Service Assignments */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Workflow Progress</CardTitle>
                <CardDescription className="text-xs md:text-sm">Track document progress through all stages</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <WorkflowBoard service={currentService} />
              </CardContent>
            </Card>
            
            {/* Service Details */}
            {currentService && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                    {currentService.title}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Current progress: Step {currentService.currentStep} of {currentService.totalSteps}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 md:p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs md:text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>{Math.round((currentService.currentStep / currentService.totalSteps) * 100)}%</span>
                      </div>
                      <Progress value={(currentService.currentStep / currentService.totalSteps) * 100} />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm md:text-base">Documents</h4>
                      <div className="space-y-2">
                        {currentService.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs md:text-sm">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 md:w-4 md:h-4" />
                              <span>{doc.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={doc.status === "completed" ? "default" : "secondary"}>{doc.status}</Badge>
                              <span className="text-gray-500 text-xs">{doc.lastModified}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Global Chat and Role Actions (switched positions) */}
          <div className="space-y-4 md:space-y-6">
            {/* Global Chat - Now at the top of right column (hidden on mobile) */}
            <div className="hidden md:block">
              <GlobalChat />
            </div>
            
            {/* Role Actions - Now below the chat */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Role Actions</CardTitle>
                <CardDescription className="text-xs md:text-sm">Actions available for your role</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <Tabs value={selectedRole} onValueChange={setSelectedRole}>
                  <div className="overflow-x-auto -mx-3 px-3">
                    <TabsList className="w-full grid grid-cols-2 bg-gray-100 p-1 min-w-[300px]">
                      <TabsTrigger 
                        value="liturgy" 
                        className={`transition-all duration-200 ${
                          selectedRole === "liturgy" 
                            ? "bg-white text-blue-700 font-medium shadow-sm border-b-2 border-blue-500" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedRole === "liturgy" && (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          )}
                          Liturgy
                        </div>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="pastor" 
                        className={`transition-all duration-200 ${
                          selectedRole === "pastor" 
                            ? "bg-white text-purple-700 font-medium shadow-sm border-b-2 border-purple-500" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedRole === "pastor" && (
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          )}
                          Pastor
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="overflow-x-auto -mx-3 px-3 mt-2">
                    <TabsList className="w-full grid grid-cols-3 bg-gray-100 p-1 min-w-[300px]">
                      <TabsTrigger 
                        value="translation" 
                        className={`transition-all duration-200 ${
                          selectedRole === "translation" 
                            ? "bg-white text-green-700 font-medium shadow-sm border-b-2 border-green-500" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedRole === "translation" && (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          )}
                          <span className="text-xs md:text-sm">Translation</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="beamer" 
                        className={`transition-all duration-200 ${
                          selectedRole === "beamer" 
                            ? "bg-white text-orange-700 font-medium shadow-sm border-b-2 border-orange-500" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedRole === "beamer" && (
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          )}
                          <span className="text-xs md:text-sm">Beamer</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="music" 
                        className={`transition-all duration-200 ${
                          selectedRole === "music" 
                            ? "bg-white text-pink-700 font-medium shadow-sm border-b-2 border-pink-500" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedRole === "music" && (
                            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                          )}
                          <span className="text-xs md:text-sm">Music</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {roles.map((role) => (
                    <TabsContent key={role.id} value={role.id} className="mt-4">
                      <ActionPanel 
                        role={role} 
                        service={currentService} 
                        currentUserRole={user.role.id} 
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
