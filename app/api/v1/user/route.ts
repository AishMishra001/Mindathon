import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

type ReadingLogRequest = {
  readingBook: string;
  readingTopic: string;
  readingMinutes: number;
  dateTime: string; // ISO string from client
  learning: string;
  questions: string;
  userId: string;
  metTarget: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const data: ReadingLogRequest = await req.json();

    const {
      readingBook,
      readingTopic,
      readingMinutes,
      dateTime,
      learning,
      questions,
      userId,
      metTarget,
    } = data;

    const inputDate = new Date(dateTime);

    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(inputDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingLog = await prisma.readingLog.findFirst({
      where: {
        userId,
        dateTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    let log;

    if (existingLog) {
      log = await prisma.readingLog.update({
        where: { id: existingLog.id },
        data: {
          readingBook,
          readingTopic,
          readingMinutes,
          dateTime: inputDate,
          learning,
          questions,
          metTarget,
        },
      });
    } else {
      log = await prisma.readingLog.create({
        data: {
          user: {
            connect: { id: userId },
          },
          readingBook,
          readingTopic,
          readingMinutes,
          dateTime: inputDate,
          learning,
          questions,
          metTarget,
        },
      });
    }

    return new Response(
      JSON.stringify({
        message: existingLog ? "Log Updated!" : "Log Created!",
        log,
      }),
      {
        status: existingLog ? 200 : 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({
        error: error?.message || "Invalid request",
      }),
      {
        status: 400,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    });
  }

  try {
    const logs = await prisma.readingLog.findMany({
      where: { userId },
      select: {
        dateTime: true,
        metTarget: true,
      },
    });

    const data = logs.map((log) => ({
      date: log.dateTime.toISOString().split("T")[0],
      metTarget: log.metTarget,
    }));

    return new Response(JSON.stringify({ streaks: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching streaks:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500 }
    );
  }
}
