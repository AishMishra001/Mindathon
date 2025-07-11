import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

type ReadingLogRequest = {
  readingBook: string;
  readingTopic: string;
  readingMinutes: number;
  dateTime: string; // Note: `req.json()` gives you a string, not a Date object
  learning: string;
  questions: string;
  userId: string;
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
    } = data;

    const newLog = await prisma.readingLog.create({
      data: {
        readingBook,
        readingTopic,
        readingMinutes,
        dateTime: new Date(dateTime), // ✅ Convert string to Date
        learning,
        questions,
        user: {
          connect: { id: userId },
        },
      },
    });

    return new Response(
      JSON.stringify({ message: "Log Created !!", log: newLog }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error handling request:", error);

    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
}
