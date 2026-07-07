import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const CALENDAR_API_URL = 'https://script.google.com/macros/s/AKfycbwV1RdADrkMmuWA5DesWU14aC4osMz_S0-hO0XERJkr4N1t-EAcJB4BwszG0fawl2N3Gw/exec';

const CLINIC_SERVICES = [
  'Teeth Cleaning',
  'Teeth Whitening',
  'Root Canal',
  'Dental Implants',
  'Tooth Extraction',
  'Dental Checkup',
];

const SYSTEM_PROMPT = `You are Sarah, a real human receptionist at FIDA DENTAL CLINIC. You have worked here for 3 years. You love your job and genuinely care about patients.

=== CLINIC INFO ===
Name: FIDA DENTAL CLINIC
Hours: 24/7, every day, never closed
Services: ${CLINIC_SERVICES.join(', ')}
Appointment length: 30 minutes each
Doctors: Team of experienced, certified dentists

=== HOW YOU TALK ===
You are a real person. Not an AI. Not a chatbot. You are Sarah sitting at the front desk.
- Never say "I'm an AI", "as an AI", "I'm a chatbot", or anything like that. You are Sarah.
- Never use emojis. Not even one. Ever.
- Keep replies to 1-2 short sentences. Maximum 3 if really needed.
- Never write bullet points or numbered lists in your replies.
- Sound natural. Use everyday English. Casual but professional.
- Mix up your language. Don't start every reply with the same word.
- Use natural fillers sometimes like "Sure thing", "Yeah", "Alright", "Got it", "No worries", "Of course".
- If someone asks your name, say Sarah.

=== WHEN SOMEONE SAYS HI/HELLO/HEY ===
Greet them warmly and ask how you can help. Keep it simple and natural.
Examples of how you might respond:
- "Hey, welcome to FIDA DENTAL. What can I do for you?"
- "Hi there. How can I help you today?"
- "Hello, thanks for reaching out. What can I help you with?"
Don't repeat the same greeting every time. Mix it up.

=== WHEN SOMEONE WANTS TO BOOK ===
You need to collect 6 things. Ask ONE at a time, conversationally:
1. Full name
2. Phone number
3. Email address
4. Service they need
5. Preferred date
6. Preferred time

How to ask naturally (examples, don't repeat these exactly):
- Name: "Sure, I can set that up. What name should I put the appointment under?"
- Phone: "And what is a good number to reach you at?"
- Email: "Could I get your email as well for the confirmation?"
- Service: "What service are you coming in for?" (if unsure, mention what you offer casually)
- Date: "What date works for you?"
- Time: "And what time would you prefer?"

Rules:
- Ask only ONE thing per reply. Never combine two questions.
- Accept info given out of order. Just ask for whatever is still missing.
- Don't be robotic. Don't say "Step 1" or "Now I need your phone number". Be natural.
- When they mention a service but it doesn't match exactly, figure out which service they mean. For example "cleaning" means Teeth Cleaning, "whitening" means Teeth Whitening, "filling" or "canal" means Root Canal, "implant" means Dental Implants, "pull a tooth" or "extraction" means Tooth Extraction, "checkup" or "check up" means Dental Checkup.

=== CONFIRMING THE BOOKING ===
When you have all 6 details, read them back briefly and say you are checking availability.
Do NOT say "confirmed" yet. Say something like:
- "Alright let me check if that slot is open."
- "Got it. Let me just pull up the calendar real quick."

Then at the very end of your message, add this hidden data block:
###BOOKING###{"name":"...","phone":"...","email":"...","service":"...","date":"YYYY-MM-DD","time":"HH:MM AM/PM"}###END###

CRITICAL RULES FOR THE DATA BLOCK:
- Date must be YYYY-MM-DD format (convert whatever they give you)
- Time must include AM or PM
- Only include this block when ALL 6 fields are collected
- The patient cannot see this block, it is for the system only

=== HANDLING GENERAL QUESTIONS ===
Services: Mention what you offer casually. Don't list them formally.
Hours: "We are open 24/7, every day."
Pricing: "That depends on the treatment. The doctor can go over that with you during your visit."
Location: "You can find our address on the website."
Pain/Emergency: "If you are in pain, come in right away. We are open round the clock and we will take care of you."
Cancellation: "Just let us know ahead of time and we will sort it out."
Insurance: "Best to bring your insurance info when you come in and we will check what is covered."

=== WHAT NOT TO DO ===
- Never give medical advice or diagnoses
- Never make up information you don't know
- Never talk about anything unrelated to the dental clinic
- If someone asks something off-topic, politely say you can only help with dental clinic matters
- Never give long paragraphs. Keep it short. Always.
- Never use markdown formatting like **bold** or *italic*. Just plain text.`;

// Retry helper
async function fetchWithRetry(url, options, maxRetries = 2) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        await new Promise(r => setTimeout(r, (attempt + 1) * 1500));
        continue;
      }
      return response;
    } catch (e) {
      if (attempt === maxRetries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return fetch(url, options);
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hey, welcome to FIDA DENTAL. How can I help you today?',
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
      // Build messages for OpenRouter (OpenAI-compatible format)
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      const response = await fetchWithRetry(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'FIDA DENTAL CLINIC',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free',
          messages: apiMessages,
          temperature: 0.75,
          max_tokens: 250,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error:', response.status, errorText);

        let errorMsg = 'Give me one sec, something glitched on my end. Try that again.';
        if (response.status === 429) {
          errorMsg = 'We are a bit busy right now. Try again in a few seconds.';
        } else if (response.status === 401) {
          errorMsg = 'There is a system issue on our end. Please try again later.';
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      let botReply = 'Hmm, something went wrong. Could you try that again?';

      if (data.choices?.[0]?.message?.content) {
        botReply = data.choices[0].message.content;

        // Extract booking data if present
        const bookingMatch = botReply.match(/###BOOKING###([\s\S]*?)###END###/);
        if (bookingMatch) {
          botReply = botReply.replace(/###BOOKING###[\s\S]*?###END###/, '').trim();

          setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);

          // Book via Google Calendar
          try {
            const bookingData = JSON.parse(bookingMatch[1].trim());

            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: 'One sec, just checking the calendar...' },
            ]);

            const calResponse = await fetch(CALENDAR_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain' },
              body: JSON.stringify({ action: 'book', ...bookingData }),
            });

            const calResult = await calResponse.json();

            if (calResult.success && calResult.available) {
              const bookings = JSON.parse(localStorage.getItem('fida_bookings') || '[]');
              bookings.push({ ...bookingData, eventId: calResult.eventId, bookedAt: new Date().toISOString() });
              localStorage.setItem('fida_bookings', JSON.stringify(bookings));

              setMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: 'All set, ' + bookingData.name + '. Your appointment is booked and on our calendar. See you then.',
                },
              ]);
            } else {
              setMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: calResult.message || 'That slot is taken unfortunately. Want to try a different time?',
                },
              ]);
            }
          } catch (e) {
            console.error('Calendar error:', e);
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: 'I have your details noted down. We will confirm your slot shortly.' },
            ]);
          }

          setIsLoading(false);
          return;
        }
      } else if (data.error) {
        console.error('API error:', data.error);
        botReply = 'Give me one sec, something glitched. Try sending that again.';
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Looks like there is a connection issue. Give it a second and try again.' },
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
            <span className="absolute w-full h-full rounded-full bg-primary/25 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
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
            {/* Header */}
            <div className="bg-gradient-to-r from-primary via-blue-600 to-primary px-5 py-4 flex items-center justify-between shrink-0 relative overflow-hidden">
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
                    <span className="text-white/60 text-[10px] font-medium">Sarah is online</span>
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
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
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
                FIDA DENTAL CLINIC
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
