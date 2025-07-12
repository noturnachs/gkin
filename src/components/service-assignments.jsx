import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar } from "lucide-react";
import {
  getUpcomingSundays,
  formatDate,
  getStatusColor,
} from "../lib/date-utils";

export function ServiceAssignments({ selectedDate }) {
  const [upcomingServices, setUpcomingServices] = useState([]);
  const [currentService, setCurrentService] = useState(null);

  // Use the shared date utility to load all services
  useEffect(() => {
    const sundays = getUpcomingSundays(4);

    // Add assignments to each Sunday
    const servicesWithAssignments = sundays.map((sunday, i) => {
      // Example assignments - in a real app, these would come from your database
      const assignments = [
        { role: "Voorganger", person: "ds. D. Kurniawan" },
        { role: "Ouderling van dienst", person: "Althea Simons-Winailan" },
        { role: "Muzikale begeleiding", person: "Charlie Hendrawan" },
        {
          role: "Voorzangers",
          person: "Yolly Wenker-Tampubolon, Teddy Simanjuntak",
        },
      ];

      // Add different people for different weeks to show variety
      if (i === 1) {
        assignments[1].person = "Johan van der Meer";
        assignments[3].person = "Maria Jansen, Peter de Vries";
      } else if (i === 2) {
        assignments[0].person = "ds. A. Visser";
        assignments[2].person = "David Smit";
      } else if (i === 3) {
        assignments[1].person = "Esther de Boer";
        assignments[3].person = "Thomas Bakker, Anna Mulder";
      }

      return {
        ...sunday,
        title: "Sunday Service",
        assignments: assignments,
      };
    });

    setUpcomingServices(servicesWithAssignments);
  }, []);

  // Update current service when selectedDate changes
  useEffect(() => {
    if (selectedDate && upcomingServices.length > 0) {
      // Try direct match first
      let service = upcomingServices.find((s) => s.dateString === selectedDate);

      // If no direct match, try to find the closest date
      if (!service) {
        // Convert selectedDate to a Date object
        const selectedDateTime = new Date(selectedDate).getTime();

        // Find the service with the closest date
        service = upcomingServices.reduce((closest, current) => {
          const currentTime = new Date(current.dateString).getTime();
          const closestTime = closest
            ? new Date(closest.dateString).getTime()
            : Infinity;

          const currentDiff = Math.abs(currentTime - selectedDateTime);
          const closestDiff = Math.abs(closestTime - selectedDateTime);

          return currentDiff < closestDiff ? current : closest;
        }, null);

        console.log("Found closest service:", service);
      } else {
        console.log("Found exact matching service:", service);
      }

      if (service) {
        setCurrentService(service);
      } else {
        // If still no match found, use the first service as fallback
        setCurrentService(upcomingServices[0]);
      }
    } else if (upcomingServices.length > 0) {
      // If no selectedDate, default to first service
      setCurrentService(upcomingServices[0]);
    }
  }, [selectedDate, upcomingServices]);

  // If services haven't been calculated yet or no current service, show loading
  if (!currentService) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-3">
          <CardTitle className="text-base font-bold flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            Service Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 flex items-center justify-center">
          <div className="text-sm text-gray-500">
            Loading service details...
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedDateString = formatDate(currentService.date);
  const statusColor = getStatusColor(currentService.daysRemaining);

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <CardTitle className="text-base font-bold flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            Service Assignments
          </CardTitle>

          <div className="flex items-center gap-1">
            <div className="text-xs font-medium text-gray-700">
              {formattedDateString}
            </div>
            <Badge className={`${statusColor} px-1.5 py-0.5 text-xs ml-1`}>
              {currentService.daysRemaining === 0
                ? "Today"
                : currentService.daysRemaining === 1
                ? "Tomorrow"
                : `${currentService.daysRemaining} days`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        {/* Assignments table - more compact layout */}
        <div className="space-y-2">
          {currentService.assignments.map((assignment, index) => (
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
                {assignment.person}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
