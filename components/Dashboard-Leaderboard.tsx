"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Trophy, Medal, Award, Clock, Users, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

interface LeaderboardEntry {
  _sum: {
    readingMinutes: number
  }
  userId: string
  name: string
  totalReadingMinutes: number
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
}

interface ProcessedEntry {
  rank: number
  userId: string
  name: string
  totalReadingTime: number
  bonus: number
  isCurrentUser: boolean
}

export default function DashboardLeaderboard() {
  const { data: session } = useSession()
  const [leaderboardData, setLeaderboardData] = useState<ProcessedEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() ; 

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!session?.user?.id) return

      try {
        setLoading(true)
        const response = await axios.get<LeaderboardData>(
          `/api/v1/leaderboard?userId=${session.user.id}&type=leaderboard`,
        )

        const processedData: ProcessedEntry[] = response.data.leaderboard
          .slice(0, 3) // Only top 3 for dashboard
          .map((entry, index) => ({
            rank: index + 1,
            userId: entry.userId,
            name: entry.name,
            totalReadingTime: entry.totalReadingMinutes,
            bonus: 0,
            isCurrentUser: entry.userId === session.user.id,
          }))

        setLeaderboardData(processedData)
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err)
        setError("Failed to load leaderboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [session?.user?.id])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
      case 3:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
      default:
        return null
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400/20 to-yellow-600/20 border-yellow-400/30"
      case 2:
        return "from-gray-300/20 to-gray-500/20 border-gray-300/30"
      case 3:
        return "from-amber-500/20 to-amber-700/20 border-amber-500/30"
      default:
        return "from-gray-600/20 to-gray-800/20 border-gray-600/30"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">🏆 Top Performers</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">🏆 Top Performers</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">🏆 Top Performers</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>Top 3</span>
        </div>
      </div>

      {/* Mobile View - Stacked Cards */}
      <div className="flex-1 sm:hidden space-y-3">
        {leaderboardData.map((entry) => (
          <div
            key={entry.userId}
            className={`bg-gradient-to-r ${getRankColor(entry.rank)} border rounded-lg p-3 ${
              entry.isCurrentUser ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {getRankIcon(entry.rank)}
                  <span className="font-bold text-sm">#{entry.rank}</span>
                </div>
                <div>
                  <p className={`font-semibold text-sm ${entry.isCurrentUser ? "text-blue-400" : "text-foreground"}`}>
                    {entry.name}
                  </p>
                  {entry.isCurrentUser && <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full">You</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono text-sm">{formatTime(entry.totalReadingTime)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Podium Style */}
      <div className="hidden sm:flex flex-1 flex-col">
        {leaderboardData.length >= 3 && (
          <div className="flex-1 flex items-end justify-center gap-2 lg:gap-4 mb-4">
            {/* 2nd Place */}
            <div className="text-center flex-1 max-w-[100px] lg:max-w-[120px]">
              <div className="bg-gradient-to-t from-gray-600/30 to-gray-400/30 border border-gray-400/30 rounded-t-lg p-2 lg:p-3 mb-1 h-16 lg:h-20 flex flex-col justify-end">
                <Medal className="w-4 h-4 lg:w-6 lg:h-6 text-gray-300 mx-auto mb-1" />
                <div className="text-white font-bold text-xs lg:text-sm">#2</div>
              </div>
              <div className="bg-card border rounded-b-lg p-2">
                <p className="font-semibold text-xs lg:text-sm truncate">{leaderboardData[1]?.name}</p>
                <p className="text-muted-foreground text-xs">{formatTime(leaderboardData[1]?.totalReadingTime)}</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center flex-1 max-w-[120px] lg:max-w-[140px]">
              <div className="bg-gradient-to-t from-yellow-600/30 to-yellow-400/30 border border-yellow-400/30 rounded-t-lg p-2 lg:p-3 mb-1 h-20 lg:h-24 flex flex-col justify-end">
                <Trophy className="w-5 h-5 lg:w-8 lg:h-8 text-yellow-400 mx-auto mb-1" />
                <div className="text-white font-bold text-sm lg:text-base">#1</div>
              </div>
              <div className="bg-card border rounded-b-lg p-2">
                <p className="font-semibold text-xs lg:text-sm truncate">{leaderboardData[0]?.name}</p>
                <p className="text-muted-foreground text-xs">{formatTime(leaderboardData[0]?.totalReadingTime)}</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center flex-1 max-w-[90px] lg:max-w-[110px]">
              <div className="bg-gradient-to-t from-amber-700/30 to-amber-500/30 border border-amber-500/30 rounded-t-lg p-2 lg:p-3 mb-1 h-12 lg:h-16 flex flex-col justify-end">
                <Award className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-white font-bold text-xs lg:text-sm">#3</div>
              </div>
              <div className="bg-card border rounded-b-lg p-2">
                <p className="font-semibold text-xs lg:text-sm truncate">{leaderboardData[2]?.name}</p>
                <p className="text-muted-foreground text-xs">{formatTime(leaderboardData[2]?.totalReadingTime)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="bg-card border rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs font-semibold text-green-500">
                {leaderboardData.length > 0 ? formatTime(leaderboardData[0]?.totalReadingTime) : "0m"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Top Score</div>
          </div>
          <div className="bg-card border rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500">{leaderboardData.length}</span>
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>
      </div>

      {/* View All Link */}
      <div className="mt-3 pt-3 border-t">
        <button onClick={()=>
            router.push("/user/dashboard/leaderboard")
        } className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  )
}
