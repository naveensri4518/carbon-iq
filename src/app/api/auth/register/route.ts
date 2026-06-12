import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import ClimateData from "@/models/ClimateData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    await connectDB();

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

      return Response.json(
        { success: false, error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      climateScore: 75,
    });



    // Generate AI Insight
    let aiInsight = "Your data suggests switching to renewable grid energy will reduce your footprint by 2.1 tons instantly.";

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


    const { encrypt } = await import("@/lib/auth");
    const { cookies } = await import("next/headers");
    const sessionToken = await encrypt({ userId: user._id.toString(), email: user.email });
    (await cookies()).set("session", sessionToken, { httpOnly: true, secure: true, path: "/" });


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
  } catch (error: unknown) {
    const err = error as Error;
    return Response.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
