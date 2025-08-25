// src/components/assignments/assignments-page.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar, Save, Plus, Trash2, ArrowLeft, ChevronRight } from "lucide-react";
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
    addMoreFutureDates 
  } = useAssignments();
  const [newRoleName, setNewRoleName] = useState("");
  const [user] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const currentService = getAssignmentsForDate(selectedWeek);
  
  const handleUpdateAssignment = (roleIndex, newPerson) => {
    updateAssignment(currentService.dateString, roleIndex, newPerson);
  };
  
  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRoleName.trim()) {
      addRole(newRoleName.trim());
      setNewRoleName("");
    }
  };
  
  const handleRemoveRole = (roleIndex) => {
    if (window.confirm("Are you sure you want to remove this role from all services?")) {
      removeRole(roleIndex);
    }
  };

  const handleAddMoreDates = () => {
    addMoreFutureDates(4); // Add 4 more future dates
    
    // Provide visual feedback
    alert("4 more future dates have been added!");
    
    // Optionally scroll to the Available Dates section
    setTimeout(() => {
      document.querySelector('.max-h-64.overflow-y-auto')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
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
          
          <Button
            variant="default" // Change from "outline" to "default" for more visibility
            size="sm"
            onClick={handleAddMoreDates}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white" // Add green color for emphasis
          >
            <Plus className="w-4 h-4" /> Add More Dates
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <WeekSelector
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
            customWeeks={assignments} // Pass assignments as customWeeks
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
                {currentService?.assignments.map((assignment, index) => (
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
                        onChange={(e) => handleUpdateAssignment(index, e.target.value)}
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
                  {currentService?.assignments.map((assignment, index) => (
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