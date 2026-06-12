import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ success: false, error: "Missing email or password" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

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
    return Response.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
