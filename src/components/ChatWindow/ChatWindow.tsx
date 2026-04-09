import A2UIRenderer from "@/components/a2ui/A2UIRenderer";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import type { ChatMessage } from "@/types/chat.types";
import { formatDateTime } from "@/utils/formatters";
import { Copy, RotateCcw, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ActivityMessage from "../ActivityMessage";
import "./ChatWindow.scss";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
  onSendHiddenMessage: (action: string, payload: unknown) => Promise<void>;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="chat-window__code-block">
      <div className="chat-window__code-header">
        <span className="chat-window__code-lang">{language}</span>
        <button className="chat-window__code-copy">
          <Copy className="chat-window__code-copy-icon" />
          Copy
        </button>
      </div>
      <pre className="chat-window__code-content">
        <code className="chat-window__code-text">{code}</code>
      </pre>
    </div>
  );
}

export default function ChatWindow({
  messages,
  isLoading,
  error,
  onReset,
  onSendHiddenMessage,
}: ChatWindowProps) {
  const bottomRef = useScrollToBottom(messages);

  return (
    <div className="chat-window">
      {/* Top bar */}
      <div className="chat-window__top-bar">
        <div className="chat-window__top-left">
          <div className="chat-window__brand-badge">
            <Sparkles className="chat-window__brand-icon" />
          </div>
          <span className="chat-window__title">AI Assistant</span>
          <span className="chat-window__status">Online</span>
        </div>
        <div className="chat-window__top-actions">
          <button
            className="chat-window__refresh-button"
            onClick={onReset}
            disabled={isLoading}
            title="Bat dau moi"
          >
            <RotateCcw className="chat-window__refresh-icon" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-window__messages-scroll">
        <div className="chat-window__messages-stack">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className={`chat-window__message-row ${
                message.role === "user"
                  ? "chat-window__message-row--user"
                  : "chat-window__message-row--assistant"
              }`}
            >
              {/* Avatar */}
              {message.role === "assistant" ? (
                <div className="chat-window__avatar chat-window__avatar--assistant">
                  <Sparkles className="chat-window__avatar-icon" />
                </div>
              ) : (
                <div className="chat-window__avatar chat-window__avatar--user">
                  <span className="chat-window__avatar-text">JD</span>
                </div>
              )}

              {/* Bubble */}
              <div
                className={`chat-window__message-col ${
                  message.role === "user"
                    ? "chat-window__message-col--user"
                    : "chat-window__message-col--assistant"
                }`}
              >
                <div
                  className={`chat-window__bubble ${
                    message.role === "user"
                      ? "chat-window__bubble--user"
                      : "chat-window__bubble--assistant"
                  }`}
                >
                  {message.content &&
                    (message.role === "assistant" ? (
                      // Nếu là AI (backend gửi) -> Dùng ActivityMessage
                      <ActivityMessage message={message.content} />
                    ) : (
                      // Nếu là User -> Giữ nguyên ReactMarkdown như cũ
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre: ({ children }) => <>{children}</>,
                          p: ({ children }) => (
                            <p className="chat-window__text-paragraph">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="chat-window__text-strong">
                              {children}
                            </strong>
                          ),
                          code: ({ className, children }) => {
                            const language =
                              className?.replace("language-", "") || "code";
                            const text = String(children).replace(/\n$/, "");
                            return className ? (
                              <CodeBlock code={text} language={language} />
                            ) : (
                              <code className="chat-window__text-inline-code">
                                {text}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ))}

                  {message.a2ui && (
                    <div className="chat-window__a2ui-block">
                      <A2UIRenderer
                        a2uiPayload={message.a2ui}
                        onSendHiddenMessage={onSendHiddenMessage}
                        isLoading={isLoading}
                      />
                    </div>
                  )}
                </div>

                <small className="chat-window__timestamp">
                  {formatDateTime(message.createdAt)}
                </small>

                {/* Actions for assistant */}
                {message.role === "assistant" && (
                  <div className="chat-window__assistant-actions">
                    <button className="chat-window__assistant-action chat-window__assistant-action--copy">
                      <Copy className="chat-window__assistant-action-icon" />
                    </button>
                    <button className="chat-window__assistant-action chat-window__assistant-action--upvote">
                      <ThumbsUp className="chat-window__assistant-action-icon" />
                    </button>
                    <button className="chat-window__assistant-action chat-window__assistant-action--downvote">
                      <ThumbsDown className="chat-window__assistant-action-icon" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {error && <p className="chat-window__error">{error}</p>}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
