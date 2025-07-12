import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from "lucide-react";
import { getUpcomingSundays } from "../lib/date-utils";

export function WeekSelector({ selectedWeek, onWeekChange }) {
  const [weeks, setWeeks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Use the shared utility to get weeks
  useEffect(() => {
    // Force refresh of sundays to ensure we get the corrected calculation
    const sundays = getUpcomingSundays();

    // Verify all dates are Sundays
    const verifiedSundays = sundays.map((sunday) => {
      const date = new Date(sunday.dateString);
      if (date.getDay() !== 0) {
        // Fix the date to be a Sunday
        const adjustment = date.getDay() === 6 ? 1 : 7 - date.getDay();
        date.setDate(date.getDate() + adjustment);
        return {
          ...sunday,
          date: date,
          dateString: date.toISOString().split("T")[0],
          title: date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        };
      }
      return sunday;
    });

    setWeeks(verifiedSundays);

    // Set initial selected week if not already set
    if (verifiedSundays.length > 0 && !selectedWeek) {
      // Find the first upcoming Sunday (not in the past)
      const upcomingSunday = verifiedSundays.find(
        (week) => week.status === "active" || week.status === "upcoming"
      );

      // If found, use it; otherwise fall back to the first week
      if (upcomingSunday) {
        onWeekChange(upcomingSunday.dateString);
      } else {
        onWeekChange(verifiedSundays[0].dateString);
      }
    }
  }, [selectedWeek, onWeekChange]);

  // Handle selectedWeek changes separately
  useEffect(() => {
    if (
      weeks.length > 0 &&
      !weeks.some((w) => w.dateString === selectedWeek) &&
      selectedWeek
    ) {
      // If the selected week isn't in our list, select the first upcoming week
      const upcomingWeek = weeks.find(
        (w) => w.status === "active" || w.status === "upcoming"
      );
      if (upcomingWeek) {
        onWeekChange(upcomingWeek.dateString);
      } else {
        // Fallback to the first week
        onWeekChange(weeks[0].dateString);
      }
    }
  }, [selectedWeek, weeks, onWeekChange]);

  // Find the current index - with safety check
  const currentIndex =
    selectedWeek && weeks.length > 0
      ? weeks.findIndex((w) => w.dateString === selectedWeek)
      : 0;

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
      onWeekChange(weeks[currentIndex - 1].dateString);
    }
  };

  const goToNext = () => {
    if (currentIndex < weeks.length - 1) {
      onWeekChange(weeks[currentIndex + 1].dateString);
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

  // Calculate days until this Sunday
  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);

    // Ensure we're comparing dates without time
    targetDate.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `in ${diffDays} days`;
  };

  // Simple loading state - with a safety check to prevent infinite loading
  if (weeks.length === 0) {
    return (
      <Card className="relative z-20 rounded-xl" variant="primary">
        <CardContent className="p-3 md:p-4 flex items-center justify-center">
          <div className="text-sm text-gray-600">Loading calendar...</div>
        </CardContent>
      </Card>
    );
  }

  // If we have weeks but no valid selection, use the first upcoming week
  if (currentIndex === -1 && weeks.length > 0) {
    // Find the first upcoming Sunday
    const upcomingWeek = weeks.find(
      (w) => w.status === "active" || w.status === "upcoming"
    );

    // This ensures we always have a valid selection
    setTimeout(
      () =>
        onWeekChange(
          upcomingWeek ? upcomingWeek.dateString : weeks[0].dateString
        ),
      0
    );

    return (
      <Card className="relative z-20 rounded-xl" variant="primary">
        <CardContent className="p-3 md:p-4 flex items-center justify-center">
          <div className="text-sm text-gray-600">Setting up calendar...</div>
        </CardContent>
      </Card>
    );
  }

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
            {weeks.slice(0, 4).map((week) => {
              const isSelected = selectedWeek === week.dateString;
              const isPast = week.status === "past";
              const isFuture = week.status === "upcoming";
              const isToday = getDaysUntil(week.dateString) === "Today";

              // Debug info
              const date = new Date(week.dateString);
              const isSunday = date.getDay() === 0;
              if (!isSunday) {
                console.warn("Non-Sunday date in week selector:", date);
              }

              return (
                <Button
                  key={week.dateString}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onWeekChange(week.dateString)}
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
                    <span className="text-xs flex items-center gap-1">
                      {formatShortDate(week.dateString)}
                      {isToday && (
                        <span className="bg-green-500 w-1.5 h-1.5 rounded-full"></span>
                      )}
                    </span>
                    <span className="text-[10px] opacity-80">
                      {isToday ? "Today" : getDaysUntil(week.dateString)}
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
                    {selectedWeek
                      ? formatShortDate(selectedWeek)
                      : "Select Week"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </Button>

                {showDropdown && weeks.length > 0 && (
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
                      const isSelected = selectedWeek === week.dateString;
                      const dayName = getDayName(week.dateString);
                      const isToday = getDaysUntil(week.dateString) === "Today";

                      return (
                        <div
                          key={week.dateString}
                          className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                            isSelected ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            onWeekChange(week.dateString);
                            setShowDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <div>
                              <div className="text-sm font-medium flex items-center gap-1">
                                {formatShortDate(week.dateString)}
                                {isToday && (
                                  <span className="bg-green-500 text-white text-[8px] px-1 rounded-full">
                                    Today
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                {dayName}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {getDaysUntil(week.dateString)}
                          </div>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
