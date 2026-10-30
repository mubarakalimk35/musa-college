"use client";
import { useState, useEffect, useRef } from "react";
import { collegeInfo, intentSynonyms, IntentKey } from "./collegeData";

function smartReply(query: string): string {
  const q = query.toLowerCase().trim();
  if (!q) return "";

  if (q.includes("salam") || q === "hi" || q === "hello" || q.includes("as-salam")) {
    return "Walaikum Salam! 👋\nMusa College ke bare me kuch bhi puchein:\n- Admission, Fee, Programs, Hostel, Timing";
  }

  let bestIntent: IntentKey | "" = "";
  let maxScore = 0;

  for (const intent in intentSynonyms) {
    const key = intent as IntentKey;
    let score = 0;
    for (const word of intentSynonyms[key]) {
      if (q.includes(word)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestIntent = key;
    }
  }

  if (maxScore > 0 && bestIntent && collegeInfo[bestIntent]) {
    return collegeInfo[bestIntent];
  }

  return "🤔 Samajh nahi aya.\nIs tarah puchein:\n- Fee kitni hai?\n- Admission kab hai?\n- Hostel hai?\n- Programs konsy hain?\n- Principal kon hai?";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "bot" as const, text: "As-salamu Alaikum! Musa College ke bare me kuch bhi puchein. 👋" }]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    const reply = smartReply(txt);
    setMsgs(prev => [...prev, { from: "user" as const, text: txt }, { from: "bot" as const, text: reply }]);
    setInput("");
  };

  return (
    <>
      <button 
        onClick={() => setOpen(!open)} 
        aria-label="Chat"
        className="fixed bottom-[calc(20px+env(safe-area-inset-bottom))] left-4 md:left-6 z-[9999] w-14 h-14 bg-[#0d2a54] md:bg-green-600 text-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center justify-center text-[22px] hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed z-[9998] left-3 right-3 bottom-[calc(84px+env(safe-area-inset-bottom))] md:left-6 md:right-auto md:w-[360px] h-[62vh] max-h-[460px] md:h-[420px] bg-white rounded-[20px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-[pop_0.2s_ease]">
          <div className="bg-[#0d2a54] md:bg-green-600 text-white p-4 font-black flex justify-between items-center text-[14px]">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Musa College Bot</span>
            <button onClick={() => setOpen(false)} className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-[#f8fafc]">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[86%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line shadow-sm ${m.from === 'bot' ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm' : 'bg-[#0d2a54] md:bg-green-600 text-white ml-auto rounded-br-sm'}`}>
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-2.5 md:p-3 border-t flex gap-2 bg-white">
            <input 
              ref={inputRef}
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && send()} 
              placeholder="Kuch bhi puchain..." 
              className="flex-1 border-2 border-gray-100 rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-blue-200 text-black bg-gray-50" 
            />
            <button onClick={send} className="bg-[#0d2a54] md:bg-green-600 text-white px-5 py-2.5 rounded-full text-[13px] font-black active:scale-95 transition">Send</button>
          </div>
        </div>
      )}
    </>
  );
}