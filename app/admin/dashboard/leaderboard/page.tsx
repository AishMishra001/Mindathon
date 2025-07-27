"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Trophy, Medal, Award, Clock, Gift } from "lucide-react";

interface LeaderboardEntry {
  _sum: {
    readingMinutes: number;
  };
  userId: string;
  name: string;
  totalReadingMinutes: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
}

interface ProcessedEntry {
  rank: number;
  userId: string;
  name: string;
  totalReadingTime: number;
  bonus: number;
  isCurrentUser: boolean;
}

export default function Leaderboard() {
  const { data: session } = useSession();
  const [leaderboardData, setLeaderboardData] = useState<ProcessedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await axios.get<LeaderboardData>(
          `/api/v1/leaderboard?userId=${session.user.id}&type=leaderboard`
        );

        const processedData: ProcessedEntry[] = response.data.leaderboard.map(
          (entry, index) => ({
            rank: index + 1,
            userId: entry.userId,
            name: entry.name,
            totalReadingTime: entry.totalReadingMinutes,
            bonus: 0, // Default bonus as requested
            isCurrentUser: entry.userId === session.user.id,
          })
        );

        setLeaderboardData(processedData);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [session?.user?.id]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">
            #{rank}
          </span>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700";
      default:
        return "bg-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-foreground border-2 border-white rounded-xl text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            🏆{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Reading Marathon
            </span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl">Leaderboard</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>July 15 - August 15, 2024</span>
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboardData.length >= 3 && (
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-4 sm:gap-8 mb-8">
              {/* 2nd Place */}
              <div className="text-center w-full max-w-[180px]">
                <div className="bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg p-4 sm:p-6 mb-2 h-24 sm:h-32 flex flex-col justify-end">
                  <Medal className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                  <div className="text-white font-bold text-sm sm:text-base">
                    #2
                  </div>
                </div>
                <div className="bg-gray-800 rounded-b-lg p-3 sm:p-4">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {leaderboardData[1]?.name}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {formatTime(leaderboardData[1]?.totalReadingTime)}
                  </p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center w-full max-w-[200px]">
                <div className="bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-lg p-4 sm:p-6 mb-2 h-32 sm:h-40 flex flex-col justify-end">
                  <Trophy className="w-10 h-10 sm:w-16 sm:h-16 text-yellow-100 mx-auto mb-2" />
                  <div className="text-white font-bold text-base sm:text-lg">
                    #1
                  </div>
                </div>
                <div className="bg-gray-800 rounded-b-lg p-3 sm:p-4">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {leaderboardData[0]?.name}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {formatTime(leaderboardData[0]?.totalReadingTime)}
                  </p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center w-full max-w-[160px]">
                <div className="bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-lg p-4 sm:p-6 mb-2 h-20 sm:h-28 flex flex-col justify-end">
                  <Award className="w-6 h-6 sm:w-10 sm:h-10 text-amber-200 mx-auto mb-2" />
                  <div className="text-white font-bold text-sm sm:text-base">
                    #3
                  </div>
                </div>
                <div className="bg-gray-800 rounded-b-lg p-3 sm:p-4">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {leaderboardData[2]?.name}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {formatTime(leaderboardData[2]?.totalReadingTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-gray-700 px-4 sm:px-6 py-4">
            <h2 className="text-xl sm:text-2xl font-bold">Complete Rankings</h2>
          </div>

          {/* Table Header */}
          <div className="bg-gray-750 px-4 sm:px-6 py-3 border-b border-gray-600">
            <div className="hidden sm:grid grid-cols-12 gap-2 sm:gap-4 text-sm font-semibold text-gray-300">
              <div className="col-span-2 sm:col-span-1">Rank</div>
              <div className="col-span-4 sm:col-span-5">Name</div>
              <div className="col-span-3 sm:col-span-3">Reading Time</div>
              <div className="col-span-3 sm:col-span-3">Bonus</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700">
            {leaderboardData.map((entry) => (
              <div
                key={entry.userId}
                className={`flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 items-start sm:items-center px-4 sm:px-6 py-4 hover:bg-gray-750 transition-colors ${
                  entry.isCurrentUser
                    ? "bg-blue-900/30 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                {/* Rank */}
                <div className="flex items-center gap-2 sm:col-span-1">
                  <div
                    className={`rounded-full p-2 ${getRankBadge(entry.rank)}`}
                  >
                    {getRankIcon(entry.rank)}
                  </div>
                  <span className="sm:hidden font-bold text-gray-300">
                    Rank
                  </span>
                </div>

                {/* Name */}
                <div className="sm:col-span-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span
                      className={`font-semibold ${
                        entry.isCurrentUser ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {entry.name}
                    </span>
                    {entry.isCurrentUser && (
                      <span className="bg-blue-600 text-xs px-2 py-1 rounded-full w-fit">
                        You
                      </span>
                    )}
                    <span className="sm:hidden text-gray-400 text-xs">
                      Name
                    </span>
                  </div>
                </div>

                {/* Reading Time */}
                <div className="flex items-center gap-2 sm:col-span-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-sm sm:text-base">
                    {formatTime(entry.totalReadingTime)}
                  </span>
                  <span className="sm:hidden text-gray-400 text-xs">
                    Reading
                  </span>
                </div>

                {/* Bonus */}
                <div className="flex items-center gap-2 sm:col-span-3">
                  <Gift className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-sm sm:text-base">
                    {entry.bonus}
                  </span>
                  <span className="sm:hidden text-gray-400 text-xs">Bonus</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {leaderboardData.length}
            </div>
            <div className="text-gray-400 text-sm">Total Participants</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {formatTime(
                leaderboardData.reduce(
                  (sum, entry) => sum + entry.totalReadingTime,
                  0
                )
              )}
            </div>
            <div className="text-gray-400 text-sm">Total Reading Time</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {leaderboardData.length > 0
                ? formatTime(
                    Math.round(
                      leaderboardData.reduce(
                        (sum, entry) => sum + entry.totalReadingTime,
                        0
                      ) / leaderboardData.length
                    )
                  )
                : "0m"}
            </div>
            <div className="text-gray-400 text-sm">Average Reading Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
