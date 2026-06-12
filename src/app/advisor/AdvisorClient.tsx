"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

type Message = { role: string; content: string };

export default function AdvisorPage({ initialMessages = [] }: { initialMessages?: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0 ? initialMessages : [{ role: "system", content: "I am CarbonIQ. How can I help you reduce your footprint today?" }]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);
  
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = text;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg }),
      });

      if (!response.ok || !response.body) throw new Error("Failed to send");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let modelResponse = "";

      setMessages(prev => [...prev, { role: "model", content: "" }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          modelResponse += decoder.decode(value, { stream: true });
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].content = modelResponse;
            return newMsgs;
          });
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: "model", content: "An error occurred connecting to the intelligence engine." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-background text-text sf-pro-display selection:bg-accent/30 font-sans pb-32 pt-12 px-6 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Intelligence</h1>
        <p className="text-muted text-lg">Your personal, data-driven climate intelligence copilot.</p>
      </header>

      {/* Apple Intelligence Style Container */}
      <div className="w-full max-w-5xl flex-1 flex flex-col relative rounded-[3rem] overflow-hidden p-[2px] shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
        {/* Animated Glow Border */}
        <div className="absolute inset-0 bg-apple-intelligence opacity-20 animate-spin-slow pointer-events-none" />
        <div className="absolute inset-0 bg-white/90 backdrop-blur-3xl m-[1px] rounded-[2.9rem] z-0" />
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide relative z-10 min-h-[500px]">
          {messages.filter(m => m.role !== 'system').map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={i} 
              className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div className={`px-6 py-4 rounded-[1.5rem] shadow-sm leading-relaxed text-[17px] tracking-tight ${
                msg.role === "user" 
                  ? "bg-accent text-white rounded-tr-sm" 
                  : "bg-transparent text-text"
              }`}>
                {msg.role !== "user" && <div className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E93] to-[#00C0FF] font-semibold text-sm flex items-center gap-1"><Sparkles size={14}/> CarbonIQ</div>}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
              <div className="px-6 py-4 rounded-[1.5rem] bg-transparent text-text rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-black/30 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-black/30 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-black/30 rounded-full animate-bounce delay-200" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 relative z-10">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-3 relative max-w-3xl mx-auto"
          >
            <div className="flex-1 relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask the intelligence engine..." 
                className="w-full bg-[#F5F5F7] border border-glass-border rounded-full px-8 py-5 text-text placeholder-muted focus:outline-none focus:border-black/20 transition-all text-[17px] shadow-sm"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-3 bg-accent disabled:opacity-50 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all hover:scale-105"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
          <div className="flex gap-3 mt-6 justify-center overflow-x-auto pb-2 scrollbar-hide">
            {["Analyze my latest data", "How can I reduce transport emissions?", "Simulate a vegan diet"].map((prompt) => (
              <button 
                key={prompt} 
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="whitespace-nowrap text-[15px] bg-transparent border border-glass-border px-5 py-2.5 rounded-full transition-all text-muted hover:text-text hover:bg-black/5"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
