"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

const PIN_THRESHOLD = 80;

export default function ChatWindow() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const [isPinned, setIsPinned] = useState(true);
  const [showJump, setShowJump] = useState(false);

  const isBusy = status === "submitted" || status === "streaming";

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const pinned = distanceFromBottom < PIN_THRESHOLD;
    setIsPinned(pinned);
    setShowJump(!pinned);
  }

  useEffect(() => {
    if (isPinned && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPinned]);

  function jumpToLatest() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    setIsPinned(true);
    setShowJump(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
    setIsPinned(true);
  }

  return (
    <div className="chat">
      <div className="chat__scroll" ref={scrollRef} onScroll={handleScroll}>
        {messages.length === 0 && (
          <p className="chat__empty">
            Ask about a scan result — e.g. &ldquo;why is port 23 risky?&rdquo; or &ldquo;what is port 445 used for?&rdquo;
          </p>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {status === "submitted" && <ThinkingIndicator />}

        {error && (
          <p className="chat__error">
            Something went wrong: {error.message || "please try again."}
          </p>
        )}
      </div>

      {showJump && (
        <button type="button" className="chat__jump" onClick={jumpToLatest}>
          ↓ Jump to latest
        </button>
      )}

      <form className="chat__input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your scan results..."
          disabled={isBusy}
          aria-label="Message"
          className="chat__input"
        />
        {isBusy ? (
          <button type="button" onClick={stop} className="chat__stop">
            Stop
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()} className="chat__send">
            Send
          </button>
        )}
      </form>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "chat__turn chat__turn--user" : "chat__turn chat__turn--assistant"}>
      {message.parts.map((part, i) => {
        if (part.type === "text" && part.text) {
          return (
            <div key={i} className={isUser ? "chat__message chat__message--user" : "chat__message chat__message--assistant"}>
              <p>{part.text}</p>
            </div>
          );
        }
        if (part.type === "tool-lookupPort") {
          return <PortToolPart key={i} part={part} />;
        }
        return null;
      })}
    </div>
  );
}

// Renders all four tool lifecycle states distinctly, per the assignment:
// input-streaming, input-available, output-available, output-error.
function PortToolPart({ part }) {
  switch (part.state) {
    case "input-streaming":
      return (
        <div className="tool-card tool-card--loading">
          <div className="tool-card__skeleton" />
          <p className="tool-card__label">Preparing port lookup…</p>
        </div>
      );

    case "input-available":
      return (
        <div className="tool-card tool-card--loading">
          <span className="tool-card__spinner" />
          <p className="tool-card__label">
            Looking up port {part.input?.port ?? "…"}
          </p>
        </div>
      );

    case "output-error":
      return (
        <div className="tool-card tool-card--error">
          <span className="tool-card__error-icon">⚠</span>
          <div>
            <p className="tool-card__error-title">Lookup failed</p>
            <p className="tool-card__error-text">{part.errorText}</p>
          </div>
        </div>
      );

    case "output-available":
      return <PortResultCard result={part.output} />;

    default:
      return null;
  }
}

// The actual rendered "result" — a real component, not a JSON dump or a
// sentence of text.
function PortResultCard({ result }) {
  const { port, service, riskLevel, description, recommendation, known } = result;

  return (
    <div className={`port-card port-card--${riskLevel}`}>
      <div className="port-card__header">
        <span className="port-card__port">Port {port}</span>
        <span className={`port-card__badge port-card__badge--${riskLevel}`}>
          {riskLevel}
        </span>
      </div>
      {known && <p className="port-card__service">{service}</p>}
      <p className="port-card__desc">{description}</p>
      <p className="port-card__rec">
        <strong>Recommendation:</strong> {recommendation}
      </p>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="chat__message chat__message--assistant chat__thinking" aria-live="polite">
      <span className="chat__dot" />
      <span className="chat__dot" />
      <span className="chat__dot" />
    </div>
  );
}