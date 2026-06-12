import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import xss from "xss";
import { z } from "zod";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    await limiter.check(10, ip); // Limit 10 requests per minute per IP

    await connectDB();
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ success: false, error: "Invalid credentials" }, { status: 400 });
    }

    const email = xss(parsed.data.email).toLowerCase();
    const password = parsed.data.password;

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

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
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
