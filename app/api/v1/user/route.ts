import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log("Received data:", data);

    // Do something with the data here (e.g., save to database)

    return new Response(JSON.stringify({ message: "Data received", data }), {
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
