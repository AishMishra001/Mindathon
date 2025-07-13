"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { useSession } from "next-auth/react"
import axios from "axios"
import { parseISO, differenceInCalendarDays, isToday } from "date-fns"

type StreakMap = {
  [date: string]: boolean
}

export default function StreakCalendar() {
  const { data: session } = useSession()
  const [logMap, setLogMap] = useState<StreakMap>({})
  const [selected, setSelected] = useState<Date | undefined>(new Date())
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)

  useEffect(() => {
    const fetchStreaks = async () => {
      if (!session?.user?.id) return

      try {
        const res = await axios.get("/api/v1/user", {
          params: { userId: session.user.id },
        })

        const map: StreakMap = {}
        const metDates: string[] = []

        res.data.streaks.forEach((log: { date: string; metTarget: boolean }) => {
          map[log.date] = log.metTarget
          if (log.metTarget) metDates.push(log.date)
        })

        setLogMap(map)
        calculateStreaks(metDates)
      } catch (error) {
        console.error("Failed to load streaks", error)
      }
    }

    fetchStreaks()
  }, [session?.user?.id])

  const calculateStreaks = (dates: string[]) => {
    const sorted = dates.map((d) => parseISO(d)).sort((a, b) => a.getTime() - b.getTime())

    let longest = 0
    let current = 0
    let prev: Date | null = null

    sorted.forEach((date) => {
      if (!prev || differenceInCalendarDays(date, prev) === 1) {
        current++
      } else {
        longest = Math.max(longest, current)
        current = 1
      }
      prev = date
    })

    if (prev && isToday(prev)) {
      setCurrentStreak(current)
    } else {
      setCurrentStreak(0)
    }

    setLongestStreak(Math.max(longest, current))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-1">🔥 Streaks</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Track your daily progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <div className="bg-card border rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-500 mb-1">{currentStreak}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Current</div>
        </div>
        <div className="bg-card border rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-500 mb-1">{longestStreak}</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Longest</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 flex flex-col">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="rounded-lg border bg-card text-card-foreground w-full flex-1 [&_.rdp-table]:w-full"
          classNames={{
            months: "flex flex-col space-y-4 w-full h-full",
            month: "space-y-2 w-full flex-1 flex flex-col",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm sm:text-base font-medium",
            nav: "space-x-1 flex items-center",
            nav_button:
              "h-6 w-6 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md hover:bg-accent transition-colors",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse flex-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-xs flex-1 text-center py-1",
            row: "flex w-full mt-1",
            cell: "relative p-0 text-center focus-within:relative focus-within:z-20 flex-1",
            day: "h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 font-normal rounded-full hover:bg-accent transition-all duration-200 mx-auto flex items-center justify-center text-xs sm:text-sm",
            day_today: "border-2 border-primary font-semibold",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
            day_disabled: "text-muted-foreground opacity-50",
            day_outside: "text-muted-foreground opacity-50",
          }}
          modifiers={{
            met: Object.entries(logMap)
              .filter(([_, met]) => met)
              .map(([date]) => new Date(date)),
            missed: Object.entries(logMap)
              .filter(([_, met]) => !met)
              .map(([date]) => new Date(date)),
          }}
          modifiersClassNames={{
            met: "bg-green-500 hover:bg-green-600 text-white font-semibold",
            missed: "bg-red-500 hover:bg-red-600 text-white font-semibold",
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-muted-foreground">Met</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-muted-foreground">Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-primary rounded-full"></div>
          <span className="text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  )
}
