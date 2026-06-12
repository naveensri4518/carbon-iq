# CarbonIQ - Climate Intelligence Copilot

**Vertical:** Sustainability & Climate Tech

CarbonIQ is a next-generation "Intelligence Engine" that creates a Digital Twin of your lifestyle to predict and reduce your environmental footprint. It is designed with a premium, Apple-inspired aesthetic (Light Mode, heavy glassmorphism, and fluid animations) to make sustainability feel like a modern, high-tech experience rather than a chore.

## Approach & Logic
Our core logic revolves around translating raw user data (Transport, Diet, Energy) into actionable, real-world intelligence:
1. **Digital Twin Simulation:** The app calculates an immediate "Climate Score" and categorizes users (e.g., "Sustainable", "At Risk").
2. **Dynamic AI Assistant:** We integrated the ultra-fast **Groq API (Llama 3.1)** to act as a personal climate copilot. The AI reads the user's specific emissions data and streams personalized reduction strategies in real-time.
3. **Gamification via UI:** We built a custom "Carbon Activity Rings" system (inspired by Apple Watch) so users can visually "close their rings" by staying under their carbon budget.
4. **Carbon Passport Identity:** Authentication is treated as a verifiable digital credential. The "Scan Carbon Passport" login flow simulates biometric authentication for your sustainability profile.

## How the Solution Works
- **Frontend:** Built with Next.js 15, Tailwind CSS, and Framer Motion for cinematic, 60fps micro-animations.
- **Backend/DB:** Next.js Server Actions communicate securely with a MongoDB Atlas cluster to store users and their footprint metrics.
- **AI Engine:** The `/api/chat` route streams responses from Groq (Llama-3.1-8b-instant), ensuring near-zero latency for the chat interface.

## Assumptions Made
1. **Data Availability:** We assume the user has access to approximate monthly data for their footprint (e.g., miles driven, grid energy usage).
2. **Passport Scanning:** The "Scan Carbon Passport" feature is a visual simulation designed to demonstrate how biometric or NFC-based digital sustainability credentials could work in the real world.
3. **Target Audience:** We assumed the target audience responds better to premium, sleek design (Apple Light Mode) rather than traditional "green/eco" themes, which can feel dated.

## Local Setup
1. Clone the repository.
2. Run `npm install` (with `--legacy-peer-deps` if resolving Groq SDK conflicts).
3. Set up `.env.local` with your `MONGODB_URI` and `GROQ_API_KEY`.
4. Ensure your IP is whitelisted on MongoDB Atlas (Network Access -> `0.0.0.0/0`).
5. Run `npm run dev` and navigate to `localhost:3000`.
