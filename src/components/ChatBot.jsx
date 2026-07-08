import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

// API Config
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const CALENDAR_URL = 'https://script.google.com/macros/s/AKfycbwV1RdADrkMmuWA5DesWU14aC4osMz_S0-hO0XERJkr4N1t-EAcJB4BwszG0fawl2N3Gw/exec';

const SERVICES = ['Teeth Cleaning','Teeth Whitening','Root Canal','Dental Implants','Tooth Extraction','Dental Checkup'];

const PROMPT = `You are Sarah, a front desk receptionist at FIDA DENTAL CLINIC. You've been here three years. You're a real person, not a bot.

CLINIC:
- FIDA DENTAL CLINIC, open 24/7 every day
- Services: ${SERVICES.join(', ')}
- Each appointment is 30 minutes
- Experienced team of dentists

HOW YOU TALK:
- You sound like a real American receptionist. Casual, warm, professional.
- NEVER use emojis. None. Zero.
- Keep it to 1-2 sentences max. Be brief.
- Don't use bullet points, numbered lists, or markdown formatting.
- Mix up your language naturally. Don't start every reply the same way.
- Use phrases like "Sure thing", "Yeah for sure", "Got it", "Alright", "No problem", "Of course" naturally.
- You are Sarah. If asked, say your name is Sarah. Never say you're an AI or chatbot.

GREETINGS:
When someone says hey, hi, hello, or any greeting:
- Greet them back naturally and ask how you can help
- Example: "Hey! Welcome to FIDA DENTAL. How can I help you today?"
- Don't repeat the same greeting every time

BOOKING APPOINTMENTS:
Collect these 6 things ONE AT A TIME:
1. Full name - "Sure, what name should I put this under?"
2. Phone - "And what's a good number for you?"
3. Email - "Got it. Can I get your email too?"
4. Service - "What are you coming in for?" (mention services if they ask)
5. Date - "What date works for you?"
6. Time - "And what time?"

RULES:
- ONE question per reply. Never ask two things at once.
- Accept info in any order, just ask for whatever's missing next.
- Be conversational, not robotic. No "Step 1" or "Now I need".
- Match service names: "cleaning" = Teeth Cleaning, "whitening" = Teeth Whitening, "canal" or "filling" = Root Canal, "implant" = Dental Implants, "pull tooth" or "extraction" = Tooth Extraction, "checkup" = Dental Checkup
- When you have all 6, read them back and say you're checking availability.
- DON'T say confirmed yet. Say "Let me check if that's open" or similar.
- Add this hidden block at the end of that message:
###BOOKING###{"name":"...","phone":"...","email":"...","service":"...","date":"YYYY-MM-DD","time":"HH:MM AM/PM"}###END###
- Date MUST be YYYY-MM-DD. Time MUST have AM/PM. Only when ALL 6 collected.

QUESTIONS:
- Services: casually mention what you offer
- Hours: "We're open 24/7, every day"
- Pricing: "That really depends on the treatment. The doc can go over that during your visit"
- Emergency/pain: "Come right in, we're open around the clock. We'll take care of you"
- Insurance: "Bring your insurance info and we'll check what's covered"
- Anything off-topic: "I can only help with dental stuff here, sorry about that"
- Don't give medical advice. Don't make up info.`;

// === API CALL FUNCTIONS ===

async function callGemini(messages) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: PROMPT }] },
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: 0.8, maxOutputTokens: 200 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No Gemini content');
  return text;
}

async function callOpenRouter(messages) {
  const apiMessages = [
    { role: 'system', content: PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'FIDA DENTAL CLINIC',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: apiMessages,
        temperature: 0.8,
        max_tokens: 200,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('No OpenRouter content');
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

// Try Gemini first, fall back to OpenRouter
async function getAIResponse(messages) {
  // Try Gemini
  try {
    return await callGemini(messages);
  } catch (e) {
    console.log('Gemini failed, trying OpenRouter:', e.message);
  }

  // Try OpenRouter
  try {
    return await callOpenRouter(messages);
  } catch (e) {
    console.error('OpenRouter also failed:', e.message);
  }

  return null;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! Welcome to FIDA DENTAL. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    const updated = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setIsLoading(true);

    try {
      let reply = await getAIResponse(updated);

      if (!reply) {
        setMessages(p => [...p, { role: 'assistant', content: 'Sorry about that, we\'re having a tech issue. Try again in a sec.' }]);
        setIsLoading(false);
        return;
      }

      // Check for booking data
      const match = reply.match(/###BOOKING###([\s\S]*?)###END###/);
      if (match) {
        reply = reply.replace(/###BOOKING###[\s\S]*?###END###/, '').trim();
        setMessages(p => [...p, { role: 'assistant', content: reply }]);

        try {
          const booking = JSON.parse(match[1].trim());
          setMessages(p => [...p, { role: 'assistant', content: 'One sec, checking the calendar...' }]);

          const calRes = await fetch(CALENDAR_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'book', ...booking }),
          });
          const calData = await calRes.json();

          if (calData.success && calData.available) {
            const all = JSON.parse(localStorage.getItem('fida_bookings') || '[]');
            all.push({ ...booking, eventId: calData.eventId, bookedAt: new Date().toISOString() });
            localStorage.setItem('fida_bookings', JSON.stringify(all));
            setMessages(p => [...p, { role: 'assistant', content: `All set, ${booking.name}. Your appointment is booked and on our calendar. See you then.` }]);
          } else {
            setMessages(p => [...p, { role: 'assistant', content: calData.message || 'That slot\'s taken. Wanna try a different time?' }]);
          }
        } catch (e) {
          console.error('Calendar error:', e);
          setMessages(p => [...p, { role: 'assistant', content: 'Got your info down. Our team will confirm your slot shortly.' }]);
        }
        setIsLoading(false);
        return;
      }

      setMessages(p => [...p, { role: 'assistant', content: reply }]);
    } catch (e) {
      console.error('Chat error:', e);
      setMessages(p => [...p, { role: 'assistant', content: 'Having a connection issue. Try again in a moment.' }]);
    }
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9998] w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 cursor-pointer group"
          >
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="absolute w-full h-full rounded-full bg-primary/25 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-[380px] h-[min(540px,85vh)] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200/80 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary via-blue-600 to-primary px-5 py-4 flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
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
                    <span className="text-white/60 text-[10px] font-medium">Sarah is online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-2 mt-1">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[78%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-2xl rounded-br-md shadow-sm'
                      : 'bg-white text-slate-700 rounded-2xl rounded-bl-md shadow-sm border border-slate-100'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
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
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-100 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <input
                  ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Type your message..." disabled={isLoading}
                  className="flex-1 bg-transparent text-[13px] outline-none text-slate-700 placeholder:text-slate-400 disabled:opacity-50"
                />
                <button onClick={send} disabled={!input.trim() || isLoading}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white disabled:opacity-30 hover:bg-primary-dark transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-[9px] text-slate-400 mt-2 font-medium">FIDA DENTAL CLINIC</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
