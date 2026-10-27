"use client";
import { useState, useEffect, useRef } from "react";
import { collegeInfo, intentSynonyms } from "./collegeData";

function smartReply(query: string) {
  const q = query.toLowerCase().trim();
  let bestIntent = "";
  let maxScore = 0;

  // Har intent ka score nikalo
  for (let intent in intentSynonyms) {
    let score = 0;
    for (let word of intentSynonyms[intent]) {
      if (q.includes(word)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  }

  // Agar koi intent mila
  if (maxScore > 0 && collegeInfo[bestIntent]) {
    return collegeInfo[bestIntent];
  }

  if (q.includes("salam") || q.includes("hi") || q.includes("hello")) {
    return "Walaikum Salam! Aap Admission, Fee, Programs, Timing, Hostel, Scholarship kuch bhi puch sakte hain.";
  }

  return "🤔 Samajh nahi aya. Aap is tarah puchein:\n- Fee kitni hai?\n- Admission kab hai?\n- Hostel hai?\n- Programs konsy hain?";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "bot", text: "As-salamu Alaikum! Musa College ke bare me kuch bhi puchein." }]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { from: "user", text: input }, { from: "bot", text: smartReply(input) }]);
    setInput("");
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 99999 }} className="w-14 h-14 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl">{open ? "✕" : "💬"}</button>
      {open && (
        <div style={{ position: 'fixed', bottom: '90px', left: '24px', zIndex: 99999 }} className="w-[350px] max-w-[90vw] h-[420px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          <div className="bg-green-600 text-white p-4 font-bold flex justify-between"><span>Musa College Bot</span><button onClick={() => setOpen(false)}>✕</button></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {msgs.map((m, i) => (<div key={i} className={`max-w-[85%] px-3 py-2 rounded-xl text-[14px] whitespace-pre-line ${m.from === 'bot' ? 'bg-white border' : 'bg-green-600 text-white ml-auto'}`}>{m.text}</div>))}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t flex gap-2 bg-white"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Kuch bhi puchain..." className="flex-1 border rounded-full px-4 py-2 text-sm outline-none text-black" /><button onClick={send} className="bg-green-600 text-white px-4 py-2 rounded-full text-sm">Send</button></div>
        </div>
      )}
    </>
  );
}