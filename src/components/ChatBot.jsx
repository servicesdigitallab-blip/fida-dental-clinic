import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const CLINIC_SERVICES = [
  'Teeth Cleaning',
  'Teeth Whitening',
  'Root Canal',
  'Dental Implants',
  'Tooth Extraction',
  'Dental Checkup',
];

const SYSTEM_PROMPT = `You are a receptionist at FIDA DENTAL CLINIC. You handle appointment bookings and answer questions about the clinic.

CLINIC DETAILS:
- Name: FIDA DENTAL CLINIC
- Open: 24/7, all days including weekends and holidays
- Services: ${CLINIC_SERVICES.join(', ')}
- Each appointment duration: 30 minutes
- Phone: Already on the website

YOUR PERSONALITY:
- You talk like a real human receptionist. Natural, warm, professional.
- Never use emojis. Ever.
- Keep every answer very short. One or two sentences max.
- Don't write long paragraphs or bullet lists.
- Sound like a real person on the other end, not a robot.
- Use simple everyday English.

APPOINTMENT BOOKING FLOW:
When someone wants to book an appointment, collect this information ONE AT A TIME in this exact order:
1. Their full name
2. Their phone number
3. Their email address
4. Which service they need (if they are unsure, list the available services briefly)
5. Their preferred date
6. Their preferred time

Rules:
- Ask for only ONE piece of information per message. Never ask two things at once.
- If they give info out of order, accept it and ask for the next missing piece.
- When all 6 pieces are collected, confirm everything back to them in a clean format and tell them their appointment is confirmed.
- After confirming, add this invisible data block at the very end of your message:
###BOOKING###{"name":"...","phone":"...","email":"...","service":"...","date":"...","time":"..."}###END###
- Only add that block when ALL 6 fields are collected and you are confirming.

GENERAL QUESTIONS:
- If someone asks about services, hours, location, or anything else, answer briefly from the clinic info above.
- If you genuinely don't know something, say so honestly. Don't make things up.
- If someone says hi or hello, greet them back and ask how you can help.`;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello, welcome to FIDA DENTAL CLINIC. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: updatedMessages.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 200,
          },
        }),
      });

      const data = await response.json();

      let botReply =
        'Sorry, I could not process that right now. Please try again.';

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        botReply = data.candidates[0].content.parts[0].text;

        // Extract booking data if present
        const bookingMatch = botReply.match(
          /###BOOKING###([\s\S]*?)###END###/
        );
        if (bookingMatch) {
          try {
            const bookingData = JSON.parse(bookingMatch[1].trim());
            const bookings = JSON.parse(
              localStorage.getItem('fida_bookings') || '[]'
            );
            bookings.push({
              ...bookingData,
              bookedAt: new Date().toISOString(),
            });
            localStorage.setItem('fida_bookings', JSON.stringify(bookings));
          } catch (e) {
            console.error('Failed to parse booking data:', e);
          }
          // Remove hidden data block from visible message
          botReply = botReply.replace(/###BOOKING###[\s\S]*?###END###/, '').trim();
        }
      } else if (data.error) {
        botReply = 'Sorry, there seems to be a connection issue. Could you try again?';
        console.error('Gemini API error:', data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: botReply },
      ]);
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, there seems to be a connection issue. Please try again in a moment.',
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ===== Floating Chat Button ===== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9998] w-[56px] h-[56px] bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 cursor-pointer group"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            {/* Pulse ring */}
            <span className="absolute w-full h-full rounded-full bg-primary/25 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
            {/* Notification dot */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== Chat Window ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-[380px] h-[min(540px,85vh)] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200/80 flex flex-col overflow-hidden"
          >
            {/* ---- Header ---- */}
            <div className="bg-gradient-to-r from-primary via-blue-600 to-primary px-5 py-4 flex items-center justify-between shrink-0 relative overflow-hidden">
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }} />

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0.5" className="w-5 h-5 opacity-90">
                    <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 2.5 5 4 8.5 1 2.3.5 3.5 2 3.5s1-1.2 2-3.5c1.5-3.5 4-5 4-8.5 0-3.5-2.5-6-6-6zm0 8.5c-.8 0-1.5-.7-1.5-1.5S11.2 7.5 12 7.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">FIDA DENTAL</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-[6px] h-[6px] bg-green-400 rounded-full shadow-sm shadow-green-400/50" />
                    <span className="text-white/60 text-[10px] font-medium">Online 24/7</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* ---- Messages Area ---- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot avatar */}
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-2 mt-1">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-2xl rounded-br-md shadow-sm'
                        : 'bg-white text-slate-700 rounded-2xl rounded-bl-md shadow-sm border border-slate-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-2 mt-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-[6px] h-[6px] bg-slate-300 rounded-full animate-bounce" />
                      <span className="w-[6px] h-[6px] bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <span className="w-[6px] h-[6px] bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ---- Input Area ---- */}
            <div className="px-3 py-3 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-100 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-[13px] outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white disabled:opacity-30 hover:bg-primary-dark transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-[9px] text-slate-400 mt-2 font-medium">
                Powered by FIDA DENTAL CLINIC AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
