import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

const WHATSAPP_ORDER_LINK =
  "https://wa.me/919799341917?text=Hi%20Kartik%20Furniture%20%F0%9F%91%8B%20%0AMujhe%20custom%20furniture%20banwana%20hai.";

const WELCOME_MESSAGE =
  "Namaste! 🙏 Main Kartik Furniture House ka AI assistant hoon. Aap furniture ke baare mein koi bhi sawaal pooch sakte hain — Bed, Sofa, Table, Chair, Door, ya Custom Work. Main Hindi aur English dono mein jawab de sakta hoon!";

const FALLBACK_MESSAGE =
  "Maafi chahta hoon, abhi jawab dene mein takleef ho rahi hai. WhatsApp pe contact karein: 9799341917";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: WELCOME_MESSAGE },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { actor } = useActor();

  // Auto-scroll to latest message
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      if (!actor) throw new Error("Actor not ready");
      const response = await actor.chatWithAI(text);
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: response || FALLBACK_MESSAGE,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: FALLBACK_MESSAGE },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        data-ocid="floating.ai_chat.button"
        className="fixed bottom-24 right-20 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        style={{
          backgroundColor: "#C8A951",
          animation: isOpen ? "none" : "pulseGold 2.5s ease-in-out infinite",
        }}
      >
        <span className="text-2xl" aria-hidden="true">
          🤖
        </span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <dialog
          open
          aria-label="Kartik Furniture AI Chat"
          data-ocid="ai_chat.panel"
          className="fixed z-50 shadow-2xl flex flex-col p-0 m-0"
          style={{
            bottom: "100px",
            right: "16px",
            width: "min(320px, calc(100vw - 32px))",
            maxHeight: "480px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(200,169,81,0.3)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ backgroundColor: "#4E342E" }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl" aria-hidden="true">
                🤖
              </span>
              <div className="min-w-0">
                <div
                  className="font-heading font-bold text-sm truncate"
                  style={{ color: "#C8A951" }}
                >
                  Kartik Furniture AI
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full bg-green-400 inline-block shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xs text-green-300">Online</span>
                  <span
                    className="text-xs ml-1 truncate"
                    style={{ color: "rgba(245,245,220,0.5)" }}
                  >
                    · Powered by NVIDIA Llama 4
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              data-ocid="ai_chat.close.button"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:opacity-70 transition-opacity shrink-0 ml-2"
              style={{ color: "rgba(245,245,220,0.7)" }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-3"
            style={{ backgroundColor: "#FDF8F0" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          backgroundColor: "#C8A951",
                          color: "#3E2723",
                          borderBottomRightRadius: "4px",
                        }
                      : {
                          backgroundColor: "#F5F5DC",
                          color: "#4E342E",
                          borderBottomLeftRadius: "4px",
                          border: "1px solid rgba(78,52,46,0.1)",
                        }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div
                className="flex justify-start"
                aria-live="polite"
                aria-label="AI is typing"
              >
                <div
                  className="flex items-center gap-1 px-4 py-3 rounded-2xl"
                  style={{
                    backgroundColor: "#F5F5DC",
                    border: "1px solid rgba(78,52,46,0.1)",
                    borderBottomLeftRadius: "4px",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full inline-block"
                      style={{
                        backgroundColor: "#C8A951",
                        animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer: WhatsApp CTA */}
          <div
            className="shrink-0 px-3 py-2 flex justify-center"
            style={{
              backgroundColor: "#FAF5E8",
              borderTop: "1px solid rgba(78,52,46,0.08)",
            }}
          >
            <a
              href={WHATSAPP_ORDER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="ai_chat.whatsapp.button"
              className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-4 py-1.5 transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "#25D366",
                color: "#fff",
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-white shrink-0"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp pe order karein
            </a>
          </div>

          {/* Input */}
          <div
            className="shrink-0 flex items-center gap-2 px-3 py-3"
            style={{
              backgroundColor: "#fff",
              borderTop: "1px solid rgba(78,52,46,0.1)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Apna sawaal likhen..."
              aria-label="Chat message input"
              data-ocid="ai_chat.message.input"
              className="flex-1 text-sm rounded-full px-4 py-2 outline-none focus:ring-2 min-w-0 disabled:opacity-50"
              style={{
                border: "1px solid rgba(78,52,46,0.2)",
                backgroundColor: "#FAF5E8",
                color: "#4E342E",
              }}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              data-ocid="ai_chat.send.button"
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: "#C8A951" }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="#4E342E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </dialog>
      )}

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 169, 81, 0.6); }
          50% { box-shadow: 0 0 0 10px rgba(200, 169, 81, 0); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
