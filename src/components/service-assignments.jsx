import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User, Music, Mic, BookOpen } from "lucide-react";

// Sample assignments data
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
      <CardHeader className="pb-3 border-b border-gray-200 p-4 md:p-6">
        <CardTitle className="text-gray-900 flex items-center gap-2 text-lg md:text-xl">
          <User className="w-4 h-4 text-muted-foreground" />
          Service Assignments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center p-3 md:p-4 gap-3">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex-shrink-0">
                <role.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm font-medium text-gray-900">{role.label}</div>
                <div className="text-xs md:text-sm text-gray-600 truncate">{role.value}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 