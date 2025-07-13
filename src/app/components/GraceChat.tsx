"use client";
import React, { useState } from "react";
import { Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUser } from "../../lib/UserContext";

const EXAMPLE_PROMPTS = [
  "Find top installers near me",
  "How do I choose a solar system?",
  "Contact support",
  "Show me my dashboard",
  "What are the benefits of solar energy?"
];

export default function GraceChat() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "grace", text: "Hi! I'm Grace, your GreenFlux AI assistant. How can I help you today?" },
  ]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { userProfile } = useUser?.() || {};
  const userName = userProfile?.first_name || userProfile?.full_name || "there";

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory([...chatHistory, { sender: "user", text: chatInput }]);
    setChatInput("");
    setShowWelcome(false);
    setTimeout(() => {
      setChatHistory(h => [...h, { sender: "grace", text: "I'm thinking... (AI response coming soon!)" }]);
    }, 800);
  };

  const handlePromptClick = (prompt: string) => {
    setChatInput("");
    setChatHistory([...chatHistory, { sender: "user", text: prompt }]);
    setShowWelcome(false);
    setTimeout(() => {
      setChatHistory(h => [...h, { sender: "grace", text: "I'm thinking... (AI response coming soon!)" }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed top-1/2 right-4 z-30 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Open Grace AI Assistant"
        onClick={() => { setChatOpen(true); setShowWelcome(true); }}
        style={{ boxShadow: "0 4px 24px 0 rgba(34,197,94,0.25)" }}
      >
        <Bot className="w-7 h-7" />
      </button>
      {/* Sidebar Chat UI with Overlay */}
      <AnimatePresence>
        {chatOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-30 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setChatOpen(false)}
            />
            {/* Sidebar */}
            <motion.aside
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gradient-to-br from-green-50 via-white to-green-100 shadow-2xl z-40 flex flex-col rounded-l-3xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-green-100 bg-green-50 rounded-tl-3xl">
                <div className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-lg text-green-700">Grace</span>
                  <span className="text-xs text-gray-500 ml-2">GreenFlux AI</span>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                  onClick={() => setChatOpen(false)}
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>
              {/* Welcome Section */}
              {showWelcome && (
                <div className="flex flex-col items-center justify-center px-8 pt-8 pb-4 text-center bg-gradient-to-br from-green-50 via-white to-green-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-200 flex items-center justify-center mb-4 shadow-lg">
                    <Bot className="w-10 h-10 text-white drop-shadow" />
                  </div>
                  <div className="text-2xl font-bold text-green-800 mb-2">Good day, {userName}!</div>
                  <div className="text-base text-gray-600 mb-4">How can I help you with anything solar, energy, or GreenFlux?</div>
                  <div className="flex flex-wrap gap-2 justify-center mb-2">
                    {EXAMPLE_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        className="px-3 py-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium shadow-sm transition"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">Choose a prompt or type your own message below.</div>
                </div>
              )}
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-transparent">
                {!showWelcome && chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "grace" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm shadow
                        ${msg.sender === "grace"
                          ? "bg-green-100 text-green-900"
                          : "bg-green-500 text-white"}
                      `}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* Chat Input */}
              <form
                className="flex items-center gap-2 px-6 py-4 border-t border-green-100 bg-white rounded-bl-3xl"
                onSubmit={handleChatSubmit}
              >
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm border-none focus:ring-0"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  autoFocus
                />
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 font-semibold"
                >
                  Send
                </Button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 