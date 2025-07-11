"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface WeekSelectorProps {
  selectedWeek: string
  onWeekChange: (week: string) => void
}

const weeks = [
  { date: "2024-01-07", title: "January 7, 2024", status: "active" },
  { date: "2024-01-14", title: "January 14, 2024", status: "upcoming" },
  { date: "2024-01-21", title: "January 21, 2024", status: "upcoming" },
  { date: "2024-01-28", title: "January 28, 2024", status: "upcoming" },
]

export function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  const currentIndex = weeks.findIndex((w) => w.date === selectedWeek)

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onWeekChange(weeks[currentIndex - 1].date)
    }
  }

  const goToNext = () => {
    if (currentIndex < weeks.length - 1) {
      onWeekChange(weeks[currentIndex + 1].date)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
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
      </CardContent>
    </Card>
  )
}
