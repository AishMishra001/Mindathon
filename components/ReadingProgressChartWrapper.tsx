"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { ReadingProgressChart } from "@/components/AppBarChart"

type ReadingData = {
  date: string
  minutes: number
}

export default function ReadingProgressChartWrapper() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<ReadingData[]>([])
  const [loading, setLoading] = useState(true)

  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return

    const fetchReadingData = async () => {
      try {
        const res = await fetch(`/api/v1/leaderboard?userId=${userId}&type=barchart`)
        const result = await res.json()
        setData(result.logs || [])
      } catch (error) {
        console.error("Failed to load chart data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReadingData()
  }, [userId])

  if (status === "loading" || loading) {
    return <div className="text-sm text-muted-foreground p-4">Loading chart...</div>
  }

  if (!userId) {
    return <div className="text-red-500 text-sm p-4">User not authenticated.</div>
  }

  return (
    <ReadingProgressChart
      title="Reading Marathon"
      description="Your daily reading log"
      data={data}
    />
  )
}
