import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log("Received data:", data);

    const {
      readingBook,
      readingTopic,
      readingMinutes,
      dateTime,
      learning,
      questions,
      userId, // must be passed from frontend
    } = data as {
      readingBook: string;
      readingTopic: string;
      readingMinutes: number;
      dateTime: Date;
      learning: string;
      questions: string;
      userId: string;
    };

    const newLog = await prisma.readingLog.create({
      data: {
        readingBook,
        readingTopic,
        readingMinutes,
        dateTime,
        learning,
        questions,
        user : {
          connect : {id : userId}
        },
      },
    });

    return new Response(JSON.stringify({ message: "Log Created !!", log : newLog  }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);

    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
}
