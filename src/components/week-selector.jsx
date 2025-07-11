import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const weeks = [
  { date: "2024-01-07", title: "January 7, 2024", status: "active" },
  { date: "2024-01-14", title: "January 14, 2024", status: "upcoming" },
  { date: "2024-01-21", title: "January 21, 2024", status: "upcoming" },
  { date: "2024-01-28", title: "January 28, 2024", status: "upcoming" },
];

export function WeekSelector({ selectedWeek, onWeekChange }) {
  const currentIndex = weeks.findIndex((w) => w.date === selectedWeek);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onWeekChange(weeks[currentIndex - 1].date);
    }
  };

  const goToNext = () => {
    if (currentIndex < weeks.length - 1) {
      onWeekChange(weeks[currentIndex + 1].date);
    }
  };

  return (
    <Card>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={goToPrevious} disabled={currentIndex <= 0} className="text-xs md:text-sm">
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto px-2 hide-scrollbar">
            {weeks.map((week) => (
              <Button
                key={week.date}
                variant={selectedWeek === week.date ? "default" : "outline"}
                size="sm"
                onClick={() => onWeekChange(week.date)}
                className="flex items-center gap-1 md:gap-2 whitespace-nowrap text-xs md:text-sm"
              >
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">{week.title}</span>
                <span className="md:hidden">{new Date(week.date).getDate()}/{new Date(week.date).getMonth() + 1}</span>
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={goToNext} disabled={currentIndex >= weeks.length - 1} className="text-xs md:text-sm">
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}