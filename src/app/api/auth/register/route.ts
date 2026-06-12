import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import ClimateData from "@/models/ClimateData";
import { model } from "@/lib/gemini";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("MongoDB connected in register route");

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { success: false, error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Registration failed: Email already exists");
      return Response.json(
        { success: false, error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      climateScore: 75,
    });

    console.log("User created:", user._id);

    // Generate AI Insight
    let aiInsight = "Your data suggests switching to renewable grid energy will reduce your footprint by 2.1 tons instantly.";
    try {
      const prompt = `Generate a short, single-sentence actionable insight for a new user to reduce their carbon footprint. Make it sound professional and data-driven.`;
      const result = await model.generateContent(prompt);
      aiInsight = result.response.text().trim();
    } catch (e) {
      console.error("Gemini failed, using fallback insight", e);
    }

    await ClimateData.create({
      userId: user._id,
      transportEmission: 42,
      foodEmission: 28,
      electricityEmission: 19,
      shoppingEmission: 11,
      totalEmission: 100,
      futurePredictions: {
        sixMonths: 95,
        oneYear: 80,
        fiveYears: 50,
      },
      aiInsight,
    });
    console.log("ClimateData seeded for user:", user._id);

    const { encrypt } = await import("@/lib/auth");
    const { cookies } = await import("next/headers");
    const sessionToken = await encrypt({ userId: user._id.toString(), email: user.email });
    (await cookies()).set("session", sessionToken, { httpOnly: true, secure: true, path: "/" });

    console.log("API response: success");
    return Response.json({
      success: true,
      token: sessionToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        climateScore: user.climateScore,
      },
    });
  } catch (error: any) {
    console.error("MongoDB/Registration Error:", error);
    return Response.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
