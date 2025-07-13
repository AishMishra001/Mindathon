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
    //  Return leaderboard data
    if (type === "leaderboard") {
      const leaderboard = await prisma.readingLog.groupBy({
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

      const formatted = logs.map((log) => ({
        date: log.dateTime.toISOString().split("T")[0],
        minutes: log.readingMinutes,
      }));

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
