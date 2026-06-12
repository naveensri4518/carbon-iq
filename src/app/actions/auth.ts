"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ClimateData from "@/models/ClimateData";
import Simulation from "@/models/Simulation";
import Passport from "@/models/Passport";
import AIChat from "@/models/AIChat";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData) {
  await dbConnect();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      climateScore: 78, // Initial baseline score
      totalSaved: 0,
    });

    // Automatically seed demo data
    await ClimateData.create({
      userId: user._id,
      transportEmission: 4.2,
      foodEmission: 3.5,
      electricityEmission: 2.1,
      shoppingEmission: 1.8,
      totalEmission: 11.6,
      futurePredictions: { sixMonths: 11.4, oneYear: 10.8, fiveYears: 8.5 },
    });

    await Simulation.create({
      userId: user._id,
      currentLifestyle: { transport: "Car Commute", diet: "Meat Heavy", energy: "Grid" },
      futureLifestyle: { transport: "Public Transit", diet: "Plant Based", energy: "Solar" },
      carbonSaved: 4.5,
      moneySaved: 3200,
    });

    await Passport.create({
      userId: user._id,
      achievements: ["Early Adopter", "Climate Pioneer"],
      carbonSaved: 0,
      treesEquivalent: 0,
      climateRank: "Emerging Hero",
    });

    await AIChat.create({
      userId: user._id,
      messages: [{ role: "system", content: "I am CarbonIQ. How can I help you reduce your footprint today?" }],
    });

    // Create session
    const sessionToken = await encrypt({ userId: user._id.toString(), email: user.email });
    (await cookies()).set("session", sessionToken, { httpOnly: true, secure: true, path: "/" });

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function loginUser(formData: FormData) {
  await dbConnect();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Missing email or password" };
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }

    // Create session
    const sessionToken = await encrypt({ userId: user._id.toString(), email: user.email });
    (await cookies()).set("session", sessionToken, { httpOnly: true, secure: true, path: "/" });

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function logoutUser() {
  (await cookies()).delete("session");
}
