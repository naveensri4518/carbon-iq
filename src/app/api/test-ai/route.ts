import { model } from "@/lib/gemini";

export async function GET() {
  try {
    const result = await model.generateContent(
      "Give one sustainability tip"
    );

    return Response.json({
      text: result.response.text(),
    });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return Response.json({
      error: error.message || "Unknown error",
    }, { status: 500 });
  }
}
