"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

// Distance from the bottom (px) within which we consider the user "pinned"
// to the latest message. Beyond this, we assume they scrolled up on purpose.
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

  // Track whether the user is scrolled to (near) the bottom. If they scroll
  // up mid-stream, we release the auto-scroll pin instead of yanking them
  // back down on every new token.
  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const pinned = distanceFromBottom < PIN_THRESHOLD;
    setIsPinned(pinned);
    setShowJump(!pinned);
  }

  // Auto-scroll on new content, but only while pinned to the bottom.
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
    setIsPinned(true); // sending a message re-pins us to the bottom
  }

  return (
    <div className="chat">
      <div className="chat__scroll" ref={scrollRef} onScroll={handleScroll}>
        {messages.length === 0 && (
          <p className="chat__empty">
            Ask about a scan result — e.g. &ldquo;why is port 23 risky?&rdquo;
          </p>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Thinking indicator: shown once a request is sent, until the first
            token of the assistant's reply actually arrives. We check for an
            in-progress assistant message with no text yet, so the indicator
            hands off to real text the moment content exists, rather than
            disappearing a frame early and causing a flicker. */}
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
  // We intentionally render plain text, not parsed markdown. Streamed
  // markdown can be mid-syntax (unclosed code fences, dangling asterisks)
  // and render broken mid-stream — plain text sidesteps that entirely for
  // this scope, at the cost of not rendering formatting like bold/lists.
  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  if (!text) return null;

  return (
    <div className={isUser ? "chat__message chat__message--user" : "chat__message chat__message--assistant"}>
      <p>{text}</p>
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
