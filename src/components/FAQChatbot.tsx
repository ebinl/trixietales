import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Search } from "lucide-react";
import { faqSections } from "./faq";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type QA = { q: string; a: string; section?: string };

const buildIndex = (): QA[] => {
  const items: QA[] = [];
  faqSections.forEach((s) => {
    s.questions.forEach((q) => items.push({ ...q, section: s.title }));
  });
  return items;
};

const tokenize = (text: string) => text.toLowerCase().split(/\W+/).filter(Boolean);

const scoreQuery = (query: string, text: string) => {
  const qTokens = tokenize(query);
  const tTokens = tokenize(text);
  if (qTokens.length === 0) return 0;
  let common = 0;
  const tSet = new Set(tTokens);
  qTokens.forEach((t) => { if (tSet.has(t)) common++; });
  return common / qTokens.length;
};

export default function FAQChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const indexRef = useRef<QA[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { indexRef.current = buildIndex(); }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  // create a new session document in Firestore
  const createSession = async () => {
    try {
      const docRef = await addDoc(collection(db, "chat_sessions"), {
        createdAt: serverTimestamp(),
      });
      setSessionId(docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("Failed to create chat session:", err);
      return null;
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { from: "user" as const, text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // persist user message
    (async () => {
      try {
        const sid = sessionId ?? (await createSession());
        if (sid) {
          await addDoc(collection(db, `chat_sessions/${sid}/messages`), {
            from: "user",
            text: trimmed,
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.error("Failed to save user message:", err);
      }
    })();

    // Simple retrieval: score against questions and answers
    const candidates = indexRef.current.map((item) => {
      const scoreQ = scoreQuery(trimmed, item.q);
      const scoreA = scoreQuery(trimmed, item.a);
      return { item, score: Math.max(scoreQ, scoreA) };
    });
    candidates.sort((a, b) => b.score - a.score);

    const best = candidates[0];
    if (best && best.score > 0) {
      const answer = `Answer (${best.item.section}): ${best.item.a}`;
      setTimeout(() => {
        setMessages((m) => [...m, { from: "bot", text: answer }]);

        // persist bot reply
        (async () => {
          try {
            const sid = sessionId ?? (await createSession());
            if (sid) {
              await addDoc(collection(db, `chat_sessions/${sid}/messages`), {
                from: "bot",
                text: answer,
                createdAt: serverTimestamp(),
              });
            }
          } catch (err) {
            console.error("Failed to save bot message:", err);
          }
        })();
      }, 500);
    } else {
      // No good match: suggest related questions
      const top = candidates.slice(0, 3).filter(c => c.score > 0).map(c => `Q: ${c.item.q}`);
      const fallback = top.length > 0
        ? `I couldn't find an exact answer. Related questions:\n${top.join("\n")}`
        : "Sorry — I couldn't find an answer in the FAQ. Try rephrasing or contact us.";
      setTimeout(() => {
        setMessages((m) => [...m, { from: "bot", text: fallback }]);

        // persist bot fallback
        (async () => {
          try {
            const sid = sessionId ?? (await createSession());
            if (sid) {
              await addDoc(collection(db, `chat_sessions/${sid}/messages`), {
                from: "bot",
                text: fallback,
                createdAt: serverTimestamp(),
              });
            }
          } catch (err) {
            console.error("Failed to save bot message:", err);
          }
        })();
      }, 500);
    }
  };

  return (
    <div>
      {/* Floating button - positioned safely above mobile bottom navbar */}
      <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] min-[1100px]:bottom-6 right-4 min-[1100px]:right-6 z-[9999]" style={{ pointerEvents: 'auto' }}>
        <button
          aria-label="Open chat"
          className="w-11 h-11 min-[1100px]:w-13 min-[1100px]:h-13 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-[#e6b76c] hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.37)] border border-white/20 hover:border-[#e6b76c]/50 flex items-center justify-center transition-all duration-300 backdrop-blur-2xl cursor-pointer"
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          type="button"
        >
          {open ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-5 h-5" />}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-[calc(9.5rem+env(safe-area-inset-bottom,0px))] right-4 min-[1100px]:bottom-20 min-[1100px]:right-6 z-[9999] w-[90vw] min-[1100px]:w-[360px] max-w-[360px] bg-white dark:bg-black/75 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800/60 backdrop-blur-xl pointer-events-auto"
          data-lenis-prevent
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">FAQ Assistant</div>
                <div className="text-xs text-muted-foreground">Answers from the site's FAQ</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMessages([])} className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">Clear</button>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="p-4 h-64 overflow-y-auto bg-gradient-to-b from-white to-transparent dark:from-slate-900 overscroll-contain"
            data-lenis-prevent
          >
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground">Ask me anything about bookings, pricing, or the photography process.</div>
            )}
            <div className="space-y-3 mt-2">
              {messages.map((m, i) => (
                <div key={i} className={`${m.from === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-3 py-2 rounded-xl ${m.from === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100'}`}>
                    {m.text.split('\n').map((line, idx) => (<div key={idx}>{line}</div>))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-3 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
            <div className="flex-1 relative">
              <label htmlFor="faq-input" className="sr-only">Ask a question</label>
              <input
                id="faq-input"
                name="faq-query"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 bg-transparent text-sm outline-none"
                placeholder="Ask a question..."
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <button onClick={handleSend} className="bg-primary p-2 rounded-xl text-white">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
