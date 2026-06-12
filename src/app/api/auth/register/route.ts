import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import ClimateData from "@/models/ClimateData";
import bcrypt from "bcryptjs";
import xss from "xss";
import { z } from "zod";
import rateLimit from "@/lib/rate-limit";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
});

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    await limiter.check(5, ip); // Limit 5 requests per minute per IP

    await connectDB();

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const name = xss(parsed.data.name);
    const email = xss(parsed.data.email).toLowerCase();
    const password = parsed.data.password;

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

    const aiInsight = "Your data suggests switching to renewable grid energy will reduce your footprint by 2.1 tons instantly.";

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

    const sessionToken = await encrypt({ userId: user._id.toString(), email: user.email });
    (await cookies()).set("session", sessionToken, { httpOnly: true, secure: true, path: "/", sameSite: "lax" });

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
    if (error === "Rate limit exceeded") {
      return Response.json({ success: false, error: "Too many requests" }, { status: 429 });
    }
    // Do not leak sensitive DB error details
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
