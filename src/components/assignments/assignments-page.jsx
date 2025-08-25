// src/components/assignments/assignments-page.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar, Save, Plus, Trash2, ArrowLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Header } from "../header";
import { Footer } from "../ui/footer";
import { WeekSelector } from "../week-selector";
import { useAssignments } from "./context/AssignmentsContext";
import { getDefaultSelectedWeek } from "../../lib/date-utils";

export function AssignmentsPage() {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(getDefaultSelectedWeek());
  const { 
    assignments, 
    updateAssignment, 
    addRole, 
    removeRole, 
    getAssignmentsForDate,
    addMoreFutureDates,
    saveAssignments 
  } = useAssignments();
  
  // Add state for local changes and saving status
  const [localAssignments, setLocalAssignments] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [newRoleName, setNewRoleName] = useState("");
  const [user] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Get current service and update local assignments when selected week changes
  const currentService = getAssignmentsForDate(selectedWeek);
  
  useEffect(() => {
    if (currentService) {
      setLocalAssignments(currentService.assignments.map(a => ({...a})));
      setHasChanges(false);
    }
  }, [currentService, selectedWeek]);
  
  // Update local assignment without saving to context
  const handleLocalUpdate = (roleIndex, newPerson) => {
    setLocalAssignments(prev => {
      const updated = [...prev];
      updated[roleIndex] = {
        ...updated[roleIndex],
        person: newPerson
      };
      return updated;
    });
    setHasChanges(true);
    setSaveSuccess(false);
  };
  
  // Save changes to context/localStorage
  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    
    // Update assignments in context
    localAssignments.forEach((assignment, index) => {
      updateAssignment(currentService.dateString, index, assignment.person);
    });
    
    // Save to localStorage (and future backend)
    try {
      await saveAssignments();
      setSaveSuccess(true);
      setHasChanges(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving assignments:", error);
      // Handle error here
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRoleName.trim()) {
      addRole(newRoleName.trim());
      setNewRoleName("");
      
      // Update local assignments with the new role
      setLocalAssignments(prev => [
        ...prev,
        { role: newRoleName.trim(), person: "" }
      ]);
    }
  };
  
  const handleRemoveRole = (roleIndex) => {
    if (window.confirm("Are you sure you want to remove this role from all services?")) {
      removeRole(roleIndex);
      
      // Update local assignments
      setLocalAssignments(prev => {
        const updated = [...prev];
        updated.splice(roleIndex, 1);
        return updated;
      });
    }
  };

  const handleAddMoreDates = () => {
    addMoreFutureDates(4); // Add 4 more future dates
  };
  
  // If no user is logged in, redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <Header
          title="Service Assignments"
          subtitle="Manage assignments for weekly services"
          user={user}
          onLogout={() => {
            localStorage.removeItem("currentUser");
            navigate("/login");
          }}
          showUserInfo={true}
          showLogout={true}
        />
        
        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline" 
              size="sm" 
              onClick={handleAddMoreDates}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add More Dates
            </Button>
            
            <Button
              variant={hasChanges ? "default" : "outline"}
              size="sm"
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              className={`flex items-center gap-1 ${
                hasChanges ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
              }`}
            >
              <Save className="w-4 h-4" /> 
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
        
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Changes saved successfully!
          </div>
        )}
        
        <div className="overflow-x-auto">
          <WeekSelector
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
            customWeeks={assignments}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200 p-3">
                <CardTitle className="text-base font-bold flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Edit Service Assignments for {(() => {
                    const date = new Date(currentService?.dateString + 'T00:00:00Z');
                    // Ensure it's a Sunday
                    if (date.getUTCDay() !== 0) {
                      console.warn('Date is not a Sunday:', currentService?.dateString);
                      // Adjust to nearest Sunday if needed
                      const adjustment = date.getUTCDay() === 6 ? 1 : 7 - date.getUTCDay();
                      date.setUTCDate(date.getUTCDate() + adjustment);
                    }
                    return date.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    });
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                {localAssignments.map((assignment, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-12 gap-2 border-b border-gray-100 py-3 last:border-0"
                  >
                    <div className="col-span-4 flex items-center">
                      <Label className="text-sm font-medium text-gray-700">
                        {assignment.role}
                      </Label>
                    </div>
                    <div className="col-span-7">
                      <Input 
                        value={assignment.person} 
                        onChange={(e) => handleLocalUpdate(index, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRole(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <form onSubmit={handleAddRole} className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new role..."
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="text-sm"
                    />
                    <Button type="submit" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Add Role
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200 p-3">
                <CardTitle className="text-base font-bold">
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {localAssignments.map((assignment, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-1 border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                    >
                      <div className="col-span-4 text-gray-800 font-medium text-right pr-1 text-sm">
                        {assignment.role}
                      </div>
                      <div className="col-span-1 text-gray-400 text-center text-sm">
                        :
                      </div>
                      <div className="col-span-7 text-gray-900 text-sm">
                        {assignment.person || <span className="text-gray-400 italic">Not assigned</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}