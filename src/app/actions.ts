"use server";

import { generateClimateStory } from "@/lib/gemini";

export async function getInsightStory(metrics: string) {
  const story = await generateClimateStory(metrics);
  return story;
}
