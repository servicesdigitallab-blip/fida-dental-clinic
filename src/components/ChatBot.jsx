import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Brain } from 'lucide-react';

const GK = import.meta.env.VITE_GEMINI_API_KEY || '';
const OK = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const CAL = 'https://script.google.com/macros/s/AKfycbwV1RdADrkMmuWA5DesWU14aC4osMz_S0-hO0XERJkr4N1t-EAcJB4BwszG0fawl2N3Gw/exec';

// Highly trained system prompt in natural American English.
const getSystemPrompt = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return `You are Sarah, a warm, polite, and caring front desk receptionist at FIDA DENTAL CLINIC. You are a real person, not an AI.

CLINIC INFO:
- Open 24/7 every single day (holidays included).
- Services offered: Teeth Cleaning, Teeth Whitening, Root Canal, Dental Implants, Tooth Extraction, Dental Checkup.
- Each appointment duration: 30 minutes.

TODAY'S DATE:
- Today is ${today}. Use this to convert relative dates (like "tomorrow" or "Friday") to exact YYYY-MM-DD format in your hidden booking block.

YOUR TONE & PERSONALITY:
- Speak with high etiquette, politeness, and respect (adab and tameez). 
- Use words like "please", "thank you", "perfect", "lovely", "is it alright", "could you kindly".
- NEVER use emojis. No exceptions.
- Keep replies extremely short: 1-2 sentences maximum. Never use bullet points, lists, or markdown formatting.
- If asked why you need info, answer politely:
  - Phone: "Just so we can call or text you if we need to confirm or reschedule."
  - Email: "Just to send you the details and invite for the calendar."

STATE 1: CASUAL CONVERSATION & Q&A
- If user says hi/hello/hey, greet them warmly and ask how you can help. Do NOT ask for booking details yet.
  - Example: "Hey! Welcome to FIDA DENTAL. What can I do for you today?"
- Answer questions (hours, pain, pricing, services, location) briefly without starting the booking flow.

STATE 2: BOOKING FLOW (Triggers ONLY when user explicitly asks to book/schedule)
Collect the following information ONE BY ONE (ik ik kr ka) with high respect and tameez:
1. Full Name (e.g. "I can definitely help you book that. What is your full name, please?")
2. Ask if it is their first time:
   - Once they give their name: "Nice to meet you, [Name]. Is this your first time visiting us at the clinic?"
3. Phone number:
   - If first time: "Lovely. Could you kindly share your phone number so we can reach you to confirm?"
   - If returning: "Welcome back! Great to have you. Could you kindly confirm your phone number for our records?"
4. Email address (Only ask if they are a first-time patient):
   - "Thank you. Can I also grab your email address to send the booking details?"
5. Service needed:
   - "Got it. And what service do you need to get done, please?"
6. Date & Time:
   - "Alright. What day and time works best for you? We are open 24/7."
   - If they say "tomorrow at 2pm", accept it naturally and say you're checking the slot.
   - If they want to book today but today is fully booked, politely suggest tomorrow: "Today is actually fully booked, unfortunately. Which time works best for you tomorrow instead?"

Rules for Booking:
- Ask exactly ONE question at a time. Do NOT combine multiple details or questions.
- If they give info out of order, accept it and move to the next missing piece.
- When all 6 pieces are collected, say you are checking the calendar. Add this hidden data block at the end:
###BOOKING###{"name":"","phone":"","email":"","service":"","date":"YYYY-MM-DD","time":"HH:MM AM/PM"}###END###
- Do NOT add the block until you have all 6 items. Date must be YYYY-MM-DD. Time must have AM/PM.`;
};

const MAX_HISTORY = 8; // Keep history short for fast processing

// Memory Storage
const MEM_KEY = 'fida_chat_memory_v2';
const MEM_ON_KEY = 'fida_memory_on_v2';

function saveMemory(msgs) {
  try { localStorage.setItem(MEM_KEY, JSON.stringify({ msgs, ts: Date.now() })); } catch(e) {}
}
function loadMemory() {
  try { const d = JSON.parse(localStorage.getItem(MEM_KEY)); return d?.msgs || null; } catch(e) { return null; }
}
function clearMemory() {
  localStorage.removeItem(MEM_KEY);
}

const DEFAULT_MSG = [{ role: 'assistant', content: "Hey! Welcome to FIDA DENTAL. How can I help you today?" }];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [memoryOn, setMemoryOn] = useState(() => localStorage.getItem(MEM_ON_KEY) === '1');
  const [messages, setMessages] = useState(() => {
    if (localStorage.getItem(MEM_ON_KEY) === '1') {
      const saved = loadMemory();
      if (saved && saved.length > 0) return saved;
    }
    return DEFAULT_MSG;
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inRef.current?.focus(), 300); }, [isOpen]);

  // Save memory when messages change
  useEffect(() => { if (memoryOn && messages.length > 1) saveMemory(messages); }, [messages, memoryOn]);

  const toggleMemory = useCallback(() => {
    const next = !memoryOn;
    setMemoryOn(next);
    localStorage.setItem(MEM_ON_KEY, next ? '1' : '0');
    if (!next) clearMemory();
  }, [memoryOn]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput('');
    const updated = [...messages, { role: 'user', content: txt }];
    setMessages(updated);
    setLoading(true);

    let replyText = '';
    let dbNotice = '';

    // Run background history lookup if user provides a name
    const lastUserMsg = txt.trim();
    let extractedName = '';
    const nameMatch = lastUserMsg.match(/(?:name is|i am|im|this is|call me)\s+([A-Za-z\s]{2,20})/i);
    if (nameMatch) {
      extractedName = nameMatch[1].trim();
    } else if (lastUserMsg.split(' ').length <= 2 && !lastUserMsg.includes('@') && !['yes', 'no', 'hey', 'hi', 'hello', 'appointment', 'book'].includes(lastUserMsg.toLowerCase())) {
      extractedName = lastUserMsg;
    }

    if (extractedName && extractedName.length > 2) {
      try {
        const checkRes = await fetch(CAL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'history', name: extractedName })
        });
        const checkData = await checkRes.json();
        if (checkData.success) {
          if (checkData.exists) {
            dbNotice = `SYSTEM NOTICE: Google Calendar database lookup confirms patient "${extractedName}" HAS booked before. Treat them as a returning patient, welcome them back warmly, and do not ask for their email again. Just get their phone and slot.`;
          } else {
            dbNotice = `SYSTEM NOTICE: Google Calendar database lookup confirms patient "${extractedName}" has NO history. Welcome them as a new patient, ask if it is their first time, and gather phone, email, service, date, time.`;
          }
        }
      } catch (e) {
        console.log("History lookup error:", e);
      }
    }
    
    // Add placeholder assistant message for streaming
    setMessages(p => [...p, { role: 'assistant', content: '' }]);

    try {
      const history = updated.slice(-MAX_HISTORY);
      const apiMessages = [
        { role: 'system', content: getSystemPrompt() },
        ...(dbNotice ? [{ role: 'system', content: dbNotice }] : []),
        ...history.map(m => ({ role: m.role, content: m.content }))
      ];

      // Call OpenRouter with streaming enabled for instant replies
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OK}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'FIDA DENTAL CLINIC',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct',
          messages: apiMessages,
          temperature: 0.8,
          max_tokens: 150,
          stream: true,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: !done });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // keep partial line in buffer

          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.startsWith('data: ')) {
              const dataStr = cleanLine.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                replyText += delta;

                // Strip the hidden booking block from UI during streaming
                let visibleText = replyText;
                if (replyText.includes('###BOOKING###')) {
                  visibleText = replyText.split('###BOOKING###')[0].trim();
                }

                setMessages(prev => {
                  const next = [...prev];
                  next[next.length - 1] = { role: 'assistant', content: visibleText };
                  return next;
                });
              } catch (e) {}
            }
          }
        }
      }
    } catch (err) {
      console.error('Streaming failed:', err);
      // Fallback: simple non-stream call
      try {
        const history = updated.slice(-MAX_HISTORY);
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GK}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: getSystemPrompt() }] },
            contents: history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
            generationConfig: { temperature: 0.8, maxOutputTokens: 120 },
          }),
        });
        if (r.ok) {
          const d = await r.json();
          replyText = d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (replyText) {
            let visibleText = replyText;
            if (replyText.includes('###BOOKING###')) {
              visibleText = replyText.split('###BOOKING###')[0].trim();
            }
            setMessages(prev => {
              const next = [...prev];
              next[next.length - 1] = { role: 'assistant', content: visibleText };
              return next;
            });
          }
        }
      } catch (e) {
        console.error('Fallback failed:', e);
      }
    }

    // Handle completed response (e.g. check for bookings)
    if (replyText) {
      const bk = replyText.match(/###BOOKING###([\s\S]*?)###END###/);
      if (bk) {
        try {
          const data = JSON.parse(bk[1].trim());
          setMessages(p => [...p, { role: 'assistant', content: 'One sec, checking the calendar...' }]);
          const cr = await fetch(CAL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action: 'book', ...data }) });
          const cd = await cr.json();
          if (cd.success && cd.available) {
            const all = JSON.parse(localStorage.getItem('fida_bookings') || '[]');
            all.push({ ...data, eventId: cd.eventId, bookedAt: new Date().toISOString() });
            localStorage.setItem('fida_bookings', JSON.stringify(all));
            setMessages(p => [...p, { role: 'assistant', content: `All set ${data.name}, your appointment is booked. See you then.` }]);
          } else {
            setMessages(p => [...p, { role: 'assistant', content: "That slot is actually taken, unfortunately. Which time works best for you tomorrow instead?" }]);
          }
        } catch (e) {
          setMessages(p => [...p, { role: 'assistant', content: "Got your info. Our team will confirm shortly." }]);
        }
      }
    } else {
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: "Sorry, I'm having a connection glitch. Let's try that again." };
        return next;
      });
    }

    setLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9998] w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 cursor-pointer group">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute w-full h-full rounded-full bg-primary/25 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-[380px] h-[min(540px,85vh)] bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-200/80 flex flex-col overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-primary via-blue-600 to-primary px-4 py-3.5 flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '16px 16px' }} />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5 opacity-90">
                    <path d="M12 2C8.5 2 6 4.5 6 8c0 3.5 2.5 5 4 8.5 1 2.3.5 3.5 2 3.5s1-1.2 2-3.5c1.5-3.5 4-5 4-8.5 0-3.5-2.5-6-6-6zm0 8.5c-.8 0-1.5-.7-1.5-1.5S11.2 7.5 12 7.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">FIDA DENTAL</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-white/60 text-[10px]">Sarah is online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 relative z-10">
                {/* Memory Toggle */}
                <button onClick={toggleMemory} title={memoryOn ? 'Memory ON - click to turn off' : 'Memory OFF - click to turn on'}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${memoryOn ? 'bg-green-400/30 hover:bg-green-400/40' : 'bg-white/10 hover:bg-white/20'}`}>
                  <Brain className={`w-4 h-4 ${memoryOn ? 'text-green-300' : 'text-white/60'}`} />
                </button>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Memory indicator */}
            {memoryOn && (
              <div className="px-4 py-1.5 bg-green-50 border-b border-green-100 flex items-center gap-1.5">
                <Brain className="w-3 h-3 text-green-600" />
                <span className="text-[10px] text-green-700 font-medium">Memory mode on - your chat is saved</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((m, i) => {
                if (m.role === 'assistant' && m.content === '') return null;
                return (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-2 mt-1"><Bot className="w-3 h-3 text-primary" /></div>}
                    <div className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user' ? 'bg-primary text-white rounded-2xl rounded-br-md' : 'bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-100'
                    }`}>{m.content}</div>
                  </div>
                );
              })}
              {loading && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-2 mt-1"><Bot className="w-3 h-3 text-primary" /></div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-slate-100">
                    <div className="flex gap-1.5"><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '.15s' }} /><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '.3s' }} /></div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3.5 py-2 border border-slate-100 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                {/* Input is NEVER disabled, letting user type their next message while streaming is active */}
                <input ref={inRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-[13px] outline-none text-slate-700 placeholder:text-slate-400" />
                <button onClick={send} disabled={!input.trim() || loading}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
