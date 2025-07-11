import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User, Music, Mic, BookOpen } from "lucide-react";

// Sample assignments data - in a real app, this would come from your backend
const serviceAssignments = {
  "2024-01-07": {
    voorganger: "ds. D. Kurniawan",
    ouderling: "Althea Simons-Winailan",
    muzikale: "Charlie Hendrawan",
    voorzangers: ["Yolly Wenker-Tampubolon", "Teddy Simanjuntak"]
  },
  "2024-01-14": {
    voorganger: "ds. B. van Smeden",
    ouderling: "Johan Pattiasina",
    muzikale: "Rudy Pattiasina",
    voorzangers: ["Mariska Manuhutu", "Erick Rumuat"]
  },
  "2024-01-21": {
    voorganger: "ds. M. Padang",
    ouderling: "Betty Latuasan",
    muzikale: "Shirley Khouw",
    voorzangers: ["Yolly Wenker-Tampubolon", "Erick Rumuat"]
  },
  "2024-01-28": {
    voorganger: "ds. D. Kurniawan",
    ouderling: "Althea Simons-Winailan",
    muzikale: "Charlie Hendrawan",
    voorzangers: ["Teddy Simanjuntak", "Mariska Manuhutu"]
  }
};

export function ServiceAssignments({ selectedDate }) {
  const assignments = serviceAssignments[selectedDate] || {};
  
  // Define role icons and labels
  const roles = [
    { 
      id: "voorganger", 
      label: "Voorganger", 
      icon: BookOpen, 
      value: assignments.voorganger || "Not assigned" 
    },
    { 
      id: "ouderling", 
      label: "Ouderling van dienst", 
      icon: User, 
      value: assignments.ouderling || "Not assigned" 
    },
    { 
      id: "muzikale", 
      label: "Muzikale begeleiding", 
      icon: Music, 
      value: assignments.muzikale || "Not assigned" 
    },
    { 
      id: "voorzangers", 
      label: "Voorzangers", 
      icon: Mic, 
      value: assignments.voorzangers ? assignments.voorzangers.join(", ") : "Not assigned" 
    }
  ];

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3 border-b border-gray-200">
        <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">
          <User className="w-4 h-4 text-muted-foreground" />
          Service Assignments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center p-4 gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                <role.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{role.label}</div>
                <div className="text-sm text-gray-600">{role.value}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 