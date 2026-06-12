"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ClimateData from "@/models/ClimateData";
import Simulation from "@/models/Simulation";
import Passport from "@/models/Passport";
import AIChat from "@/models/AIChat";
import { getSession } from "@/lib/auth";

export async function getUserData() {
  await dbConnect();
  const session = await getSession();
  
  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  const user = await User.findById(session.userId).lean();
  let climateData = await ClimateData.findOne({ userId: session.userId }).lean();
  
  if (!climateData) {
    let aiInsight = "Your data suggests switching to renewable grid energy will reduce your footprint by 2.1 tons instantly.";
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Generate a short, single-sentence actionable insight for a new user to reduce their carbon footprint." }],
          model: "llama-3.1-8b-instant"
        })
      });
      const result = await response.json();
      aiInsight = result.choices?.[0]?.message?.content?.trim() || aiInsight;
    } catch (e) {
      console.error("Groq failed in data.ts", e);
    }

    const newDoc = await ClimateData.create({
      userId: session.userId,
      transportEmission: 42,
      foodEmission: 28,
      electricityEmission: 19,
      shoppingEmission: 11,
      totalEmission: 100,
      futurePredictions: { sixMonths: 95, oneYear: 80, fiveYears: 50 },
      aiInsight,
    });
    climateData = newDoc.toObject();
  }

  return { user, climateData };
}

export async function getSimulationData() {
  await dbConnect();
  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  const sim = await Simulation.findOne({ userId: session.userId }).lean();
  return { simulation: sim };
}

export async function getPassportData() {
  await dbConnect();
  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  let passport = await Passport.findOne({ userId: session.userId }).lean();
  const user = await User.findById(session.userId).lean();
  
  if (!passport) {
    const newDoc = await Passport.create({
      userId: session.userId,
      climateRank: "Eco-Beginner",
      carbonSaved: 0,
      treesEquivalent: 0,
      achievements: ["First Step"]
    });
    passport = newDoc.toObject();
  }

  return JSON.parse(JSON.stringify({ passport, user }));
}

export async function getChatHistory() {
  await dbConnect();
  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  const chat = await AIChat.findOne({ userId: session.userId }).lean() as any;
  return { messages: chat?.messages || [] };
}
