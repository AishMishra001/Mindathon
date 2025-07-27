import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function UserLogs({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-red-950">
        <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-red-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-300">
                Access Denied
              </h3>
              <p className="text-red-400">
                You don't have permission to access this page
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { name: true, email: true },
  });

  if (!user) return notFound();

  const logs = await prisma.readingLog.findMany({
    where: { userId: params.userId },
    orderBy: { dateTime: "desc" },
  });

  const totalMinutes = logs.reduce((sum, log) => sum + log.readingMinutes, 0);
  const targetsMetCount = logs.filter((log) => log.metTarget).length;
  const targetPercentage =
    logs.length > 0 ? Math.round((targetsMetCount / logs.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-primary-foreground from-gray-900 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/admin/dashboard/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Participants</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700/50">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.name || "Unnamed User"}
                </h1>
                <p className="text-gray-400 mb-4">{user.email}</p>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-4 shadow-lg">
                    <div className="text-sm font-medium opacity-90">
                      Total Logs
                    </div>
                    <div className="text-2xl font-bold">{logs.length}</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-4 shadow-lg">
                    <div className="text-sm font-medium opacity-90">
                      Reading Minutes
                    </div>
                    <div className="text-2xl font-bold">{totalMinutes}</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-4 shadow-lg">
                    <div className="text-sm font-medium opacity-90">
                      Target Success
                    </div>
                    <div className="text-2xl font-bold">
                      {targetPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Section */}
        <div className="bg-primary-foreground border-2 border-white backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Reading Logs</span>
            </h2>
          </div>

          {logs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Reading Logs Found
              </h3>
              <p className="text-gray-500">
                This participant hasn't logged any reading sessions yet.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-6">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-200 overflow-hidden border border-gray-700/50 hover:border-blue-500/50"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 px-6 py-4 border-b border-gray-600/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {log.readingBook}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {new Date(log.dateTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                              log.metTarget
                                ? "bg-green-900/50 text-green-300 border-green-600/50"
                                : "bg-red-900/50 text-red-300 border-red-600/50"
                            }`}
                          >
                            {log.metTarget
                              ? "✅ Target Met"
                              : "❌ Target Missed"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-900/50 border border-blue-600/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                              <svg
                                className="w-4 h-4 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-300">
                                Topic
                              </p>
                              <p className="text-white">{log.readingTopic}</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-900/50 border border-green-600/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                              <svg
                                className="w-4 h-4 text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-300">
                                Reading Time
                              </p>
                              <p className="text-white">
                                {log.readingMinutes} minutes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(log.learning || log.questions) && (
                        <div className="space-y-4">
                          {log.learning && (
                            <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-blue-300 mb-2">
                                    Key Learnings
                                  </h4>
                                  <p className="text-blue-100">
                                    {log.learning}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {log.questions && (
                            <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-purple-300 mb-2">
                                    Questions & Reflections
                                  </h4>
                                  <p className="text-purple-100">
                                    {log.questions}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
