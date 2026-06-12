import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AIChat from "@/models/AIChat";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

    await dbConnect();

    // Fetch chat history
    let chatRecord = await AIChat.findOne({ userId: session.userId });
    if (!chatRecord) {
      chatRecord = await AIChat.create({
        userId: session.userId,
        messages: [{ role: "system", content: "You are CarbonIQ, a helpful climate intelligence copilot. Your goal is to help users reduce their carbon footprint." }]
      });
    }

    // Add user message
    chatRecord.messages.push({ role: "user", content: prompt, timestamp: new Date() });
    await chatRecord.save();

    // Build context for Groq
    const messages = chatRecord.messages.map((m: any) => ({
      role: m.role === "model" ? "assistant" : m.role,
      content: m.content
    }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages,
        model: "llama-3.1-8b-instant",
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${await response.text()}`);
    }

    // Create a ReadableStream to stream the response back
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        try {
          while (reader) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const data = JSON.parse(line.slice(6));
                  const text = data.choices[0]?.delta?.content || "";
                  fullResponse += text;
                  if (text) {
                    controller.enqueue(new TextEncoder().encode(text));
                  }
                } catch (e) {
                  // Ignore parsing errors for incomplete chunks
                }
              }
            }
          }
          // Save model response to DB after stream finishes
          chatRecord.messages.push({ role: "model", content: fullResponse, timestamp: new Date() });
          await chatRecord.save();
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
