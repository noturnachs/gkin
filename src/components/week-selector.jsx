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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get day name for the selected date
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <Card className="relative z-20 rounded-xl" variant="primary">
      <CardContent className="p-3 md:p-4">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentIndex <= 0}
            className="border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            {weeks.map((week) => {
              const isSelected = selectedWeek === week.date;
              const isPast = new Date(week.date) < new Date() && !isSelected;
              const isFuture = new Date(week.date) > new Date() && !isSelected;

              return (
                <Button
                  key={week.date}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onWeekChange(week.date)}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-700 shadow-md hover:bg-blue-700"
                      : isPast
                      ? "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                      : isFuture
                      ? "border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                      : "border-gray-400 text-gray-800 hover:bg-gray-50 hover:border-gray-500"
                  }`}
                >
                  <Calendar
                    className={`w-4 h-4 ${
                      isSelected ? "text-white" : "text-gray-600"
                    }`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-xs">
                      {new Date(week.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-[10px] opacity-80">
                      {new Date(week.date).getFullYear()}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={currentIndex >= weeks.length - 1}
            className="border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-sm"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                disabled={currentIndex <= 0}
                className="border-gray-400 text-gray-700 hover:bg-gray-100 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="relative flex-1 mx-2">
                <Button
                  ref={buttonRef}
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full bg-white border-gray-400 text-gray-800 shadow-sm hover:bg-gray-50 hover:border-gray-500 transition-all duration-200"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">
                    {formatShortDate(selectedWeek)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </Button>

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="fixed left-1/2 transform -translate-x-1/2 mt-1 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 hover:border-gray-300 transition-all duration-200"
                    style={{
                      top: buttonRef.current
                        ? buttonRef.current.getBoundingClientRect().bottom +
                          window.scrollY +
                          5
                        : "auto",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {weeks.map((week) => {
                      const isSelected = selectedWeek === week.date;
                      const dayName = getDayName(week.date);

                      return (
                        <div
                          key={week.date}
                          className={`p-3 border-b border-gray-100 last:border-0 transition-all duration-200 ${
                            isSelected
                              ? "bg-blue-50 border-l-4 border-l-blue-600"
                              : "hover:bg-gray-50 border-l-4 border-l-transparent hover:border-l-gray-300"
                          } cursor-pointer flex items-center`}
                          onClick={() => {
                            onWeekChange(week.date);
                            setShowDropdown(false);
                          }}
                        >
                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                isSelected ? "text-blue-700" : "text-gray-800"
                              }`}
                            >
                              {new Date(week.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {dayName}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentIndex >= weeks.length - 1}
                className="border-gray-400 text-gray-700 hover:bg-gray-100 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center text-sm font-medium text-gray-800">
              {getDayName(selectedWeek)},{" "}
              {new Date(selectedWeek).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
