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
  const [selectedRole, setSelectedRole] = useState("liturgy");
  const [selectedWeek, setSelectedWeek] = useState("2024-01-07");

  const currentService = mockServices.find((s) => s.date === selectedWeek);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Liturgy Workflow Dashboard</h1>
            <p className="text-gray-600">Manage document workflow for weekly services</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <FileText className="w-4 h-4" />
              Google Drive
            </Button>
          </div>
        </div>

        {/* Week Selector */}
        <WeekSelector selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Services in workflow</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Actions requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Active team roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground">This week's progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow Board */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Progress</CardTitle>
                <CardDescription>Track document progress through all stages</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowBoard service={currentService} />
              </CardContent>
            </Card>
          </div>

          {/* Role-based Actions */}
          <div>
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Role Actions</CardTitle>
                <CardDescription className="text-gray-600">Actions available for your role</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedRole} onValueChange={setSelectedRole}>
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                    <TabsTrigger 
                      value="liturgy" 
                      className={selectedRole === "liturgy" ? "bg-white text-blue-700 font-medium shadow-sm" : "text-gray-700"}
                    >
                      Liturgy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pastor" 
                      className={selectedRole === "pastor" ? "bg-white text-purple-700 font-medium shadow-sm" : "text-gray-700"}
                    >
                      Pastor
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-3 mt-2 bg-gray-100">
                    <TabsTrigger 
                      value="translation" 
                      className={selectedRole === "translation" ? "bg-white text-green-700 font-medium shadow-sm" : "text-gray-700"}
                    >
                      Translation
                    </TabsTrigger>
                    <TabsTrigger 
                      value="beamer" 
                      className={selectedRole === "beamer" ? "bg-white text-orange-700 font-medium shadow-sm" : "text-gray-700"}
                    >
                      Beamer
                    </TabsTrigger>
                    <TabsTrigger 
                      value="music" 
                      className={selectedRole === "music" ? "bg-white text-pink-700 font-medium shadow-sm" : "text-gray-700"}
                    >
                      Music
                    </TabsTrigger>
                  </TabsList>

                  {roles.map((role) => (
                    <TabsContent key={role.id} value={role.id} className="mt-4">
                      <ActionPanel role={role} service={currentService} />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Details */}
        {currentService && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {currentService.title}
              </CardTitle>
              <CardDescription>
                Current progress: Step {currentService.currentStep} of {currentService.totalSteps}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round((currentService.currentStep / currentService.totalSteps) * 100)}%</span>
                  </div>
                  <Progress value={(currentService.currentStep / currentService.totalSteps) * 100} />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Documents</h4>
                  <div className="space-y-2">
                    {currentService.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={doc.status === "completed" ? "default" : "secondary"}>{doc.status}</Badge>
                          <span className="text-xs text-gray-500">{doc.lastModified}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Global Chat */}
        <div className="mt-6">
          <GlobalChat />
        </div>
      </div>
    </div>
  );
}

export default App;
