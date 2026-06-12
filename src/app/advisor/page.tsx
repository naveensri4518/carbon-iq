import AdvisorClient from "./AdvisorClient";

export default async function AdvisorServerPage() {
  // For the hackathon demo, we always start with a fresh clean chat session
  return <AdvisorClient initialMessages={[]} />;
}
