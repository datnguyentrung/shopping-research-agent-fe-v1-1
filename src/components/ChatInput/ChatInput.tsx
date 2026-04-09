import { Globe, Mic, Paperclip, Send } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import "./ChatInput.scss";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ChatInput({
  onSend,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !isLoading) {
      await onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 180) + "px";
    }
  };

  const canSend = message.trim().length > 0 && !isLoading;

  return (
    <div className="chat-input">
      <div className="chat-input__container">
        <form onSubmit={handleSubmit}>
          <div
            className={`chat-input__box ${
              canSend ? "chat-input__box--active" : "chat-input__box--idle"
            }`}
          >
            {/* Textarea */}
            <div className="chat-input__textarea-wrap">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Message AI Assistant..."
                className="chat-input__textarea"
                rows={1}
                style={{ minHeight: "24px", maxHeight: "180px" }}
                disabled={isLoading}
              />
            </div>

            {/* Bottom toolbar */}
            <div className="chat-input__toolbar">
              <div className="chat-input__tools">
                <button
                  type="button"
                  className="chat-input__tool-button"
                  title="Attach file"
                >
                  <Paperclip className="chat-input__tool-icon" />
                </button>
                <button
                  type="button"
                  className="chat-input__tool-button"
                  title="Voice input"
                >
                  <Mic className="chat-input__tool-icon" />
                </button>
                <button type="button" className="chat-input__web-search">
                  <Globe className="chat-input__web-search-icon" />
                  <span>Web search</span>
                </button>
              </div>

              <div className="chat-input__send-zone">
                <span className="chat-input__hint">
                  {isLoading
                    ? "Dang gui..."
                    : canSend
                      ? `${message.length} chars`
                      : "Shift+Enter for new line"}
                </span>
                <motion.button
                  type="submit"
                  disabled={!canSend}
                  whileHover={canSend ? { scale: 1.04 } : {}}
                  whileTap={canSend ? { scale: 0.96 } : {}}
                  className={`chat-input__send-button ${
                    canSend
                      ? "chat-input__send-button--active"
                      : "chat-input__send-button--disabled"
                  }`}
                >
                  <Send className="chat-input__send-icon" />
                  <span>Send</span>
                </motion.button>
              </div>
            </div>
          </div>
        </form>

        <div className="chat-input__disclaimer">
          AI can make mistakes. Always verify important information.
        </div>
      </div>
    </div>
  );
}
