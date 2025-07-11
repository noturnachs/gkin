import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from "lucide-react";

const weeks = [
  { date: "2024-01-07", title: "January 7, 2024", status: "active" },
  { date: "2024-01-14", title: "January 14, 2024", status: "upcoming" },
  { date: "2024-01-21", title: "January 21, 2024", status: "upcoming" },
  { date: "2024-01-28", title: "January 28, 2024", status: "upcoming" },
];

export function WeekSelector({ selectedWeek, onWeekChange }) {
  const currentIndex = weeks.findIndex((w) => w.date === selectedWeek);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(event.target) && 
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <Card className="relative z-20">
      <CardContent className="p-3 md:p-4">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={goToPrevious} disabled={currentIndex <= 0}>
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            {weeks.map((week) => (
              <Button
                key={week.date}
                variant={selectedWeek === week.date ? "default" : "outline"}
                size="sm"
                onClick={() => onWeekChange(week.date)}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {week.title}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={goToNext} disabled={currentIndex >= weeks.length - 1}>
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={goToPrevious} disabled={currentIndex <= 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="relative flex-1 mx-2">
              <Button 
                ref={buttonRef}
                variant="outline" 
                className="flex items-center justify-center gap-2 w-full"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Calendar className="w-4 h-4" />
                <span>{formatShortDate(selectedWeek)}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showDropdown && (
                <div 
                  ref={dropdownRef}
                  className="fixed left-1/2 transform -translate-x-1/2 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  style={{
                    top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 5 : 'auto',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  {weeks.map((week) => (
                    <div 
                      key={week.date}
                      className={`p-2 ${selectedWeek === week.date ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'} cursor-pointer`}
                      onClick={() => {
                        onWeekChange(week.date);
                        setShowDropdown(false);
                      }}
                    >
                      {new Date(week.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button variant="outline" size="sm" onClick={goToNext} disabled={currentIndex >= weeks.length - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}