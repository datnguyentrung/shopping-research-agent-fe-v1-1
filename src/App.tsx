import { ChatInput, ChatWindow, Sidebar } from "@/components";
import { useChatSSE } from "@/hooks/useChatSSE";
import "./App.scss";

export default function App() {
  // const [messages, setMessages] = useState([
  //   {
  //     id: 1,
  //     role: "assistant" as const,
  //     content:
  //       "Hello! I'm your AI assistant. How can I help you today? Feel free to ask me anything — I'm here to help.",
  //   },
  //   {
  //     id: 2,
  //     role: "user" as const,
  //     content:
  //       "Can you help me understand how React hooks work, particularly useState and useEffect?",
  //   },
  //   {
  //     id: 3,
  //     role: "assistant" as const,
  //     content:
  //       "Of course! React hooks are functions that let you use state and other React features in functional components.\n\n**useState** is a hook that lets you add state to your functional components. It returns an array with two elements: the current state value and a function to update it.\n\n**useEffect** is a hook that lets you perform side effects in functional components. It runs after every render by default, but you can control when it runs using the dependency array.",
  //   },
  //   {
  //     id: 4,
  //     role: "user" as const,
  //     content: "That's helpful! Can you show me a practical example?",
  //   },
  //   {
  //     id: 5,
  //     role: "assistant" as const,
  //     content:
  //       "Here's a practical example:\n\n```javascript\nimport { useState, useEffect } from 'react';\n\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n  \n  useEffect(() => {\n    const interval = setInterval(() => {\n      setSeconds(prev => prev + 1);\n    }, 1000);\n    \n    return () => clearInterval(interval);\n  }, []);\n  \n  return <div>Seconds: {seconds}</div>;\n}\n```\n\nThis component uses `useState` to track seconds and `useEffect` to set up a timer that increments every second. The cleanup function returned from `useEffect` clears the interval when the component unmounts.",
  //   },
  // ]);
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    sendHiddenMessage,
    resetChat,
  } = useChatSSE();

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onReset={resetChat}
          onSendHiddenMessage={sendHiddenMessage}
          error={error}
        />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
