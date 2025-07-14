import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const type = searchParams.get("type"); // "leaderboard" or "barchart"

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    });
  }

  try {
    // Return leaderboard data
    if (type === "leaderboard") {
      const grouped = await prisma.readingLog.groupBy({
        by: ["userId"],
        _sum: {
          readingMinutes: true,
        },
        orderBy: {
          _sum: {
            readingMinutes: "desc",
          },
        },
      });

      const userIds: string[] = grouped.map(
        (entry: { userId: string }) => entry.userId
      );

      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
      });

      const userMap: Map<string, string> = new Map(
        users.map((user: { id: string; name: string | null }) => [
          user.id,
          user.name || "Unnamed",
        ])
      );

      const leaderboard: {
        userId: string;
        name: string | undefined;
        totalReadingMinutes: number;
      }[] = grouped.map(
        (entry: {
          userId: string;
          _sum: {
            readingMinutes: number | null;
          };
        }) => ({
          userId: entry.userId,
          name: userMap.get(entry.userId),
          totalReadingMinutes: entry._sum.readingMinutes ?? 0,
        })
      );

      return new Response(JSON.stringify({ leaderboard }), {
        status: 200,
      });
    }

    // Return detailed logs for bar chart
    if (type === "barchart") {
      const logs = await prisma.readingLog.findMany({
        where: { userId },
        orderBy: {
          dateTime: "asc",
        },
        select: {
          dateTime: true,
          readingMinutes: true,
        },
      });

      const formatted: { date: string; minutes: number }[] = logs.map(
        (log) => ({
          date: log.dateTime.toISOString().split("T")[0],
          minutes: log.readingMinutes,
        })
      );

      return new Response(JSON.stringify({ logs: formatted }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Missing or invalid type" }), {
      status: 400,
    });
  } catch (error: any) {
    console.error("Error in GET /readingLog", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
