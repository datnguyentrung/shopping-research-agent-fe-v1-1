import { Menu, MessageSquare, Plus, Search, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import "./Sidebar.scss";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeChat, setActiveChat] = useState(1);

  const chatHistory = [
    {
      id: 1,
      title: "React hooks explained",
      time: "Just now",
      category: "Today",
    },
    {
      id: 2,
      title: "Web scraping with Python",
      time: "2h ago",
      category: "Today",
    },
    {
      id: 3,
      title: "React component optimization",
      time: "Yesterday",
      category: "Yesterday",
    },
    {
      id: 4,
      title: "Database schema design",
      time: "2 days ago",
      category: "Previous 7 Days",
    },
    {
      id: 5,
      title: "API authentication best practices",
      time: "3 days ago",
      category: "Previous 7 Days",
    },
    {
      id: 6,
      title: "CSS Grid layout examples",
      time: "1 week ago",
      category: "Previous 7 Days",
    },
  ];

  const grouped = chatHistory.reduce(
    (acc, chat) => {
      if (!acc[chat.category]) acc[chat.category] = [];
      acc[chat.category].push(chat);
      return acc;
    },
    {} as Record<string, typeof chatHistory>,
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "64px" : "268px" }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="chat-sidebar"
    >
      {/* Header */}
      <div className="chat-sidebar__header">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="chat-sidebar__toggle"
          title="Toggle sidebar"
        >
          <Menu className="chat-sidebar__toggle-icon" />
        </button>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="chat-sidebar__new-chat"
            >
              <Plus className="chat-sidebar__new-chat-icon" />
              <span>New Chat</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="chat-sidebar__search-wrap"
          >
            <div className="chat-sidebar__search-box">
              <Search className="chat-sidebar__search-icon" />
              <input
                type="text"
                placeholder="Search chats..."
                className="chat-sidebar__search-input"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat List */}
      <div className="chat-sidebar__list">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="chat-sidebar__list-expanded"
            >
              {Object.entries(grouped).map(([category, chats]) => (
                <div key={category} className="chat-sidebar__section">
                  <div className="chat-sidebar__section-title">{category}</div>
                  <div className="chat-sidebar__section-items">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setActiveChat(chat.id)}
                        className={`chat-sidebar__chat-item ${
                          activeChat === chat.id
                            ? "chat-sidebar__chat-item--active"
                            : "chat-sidebar__chat-item--idle"
                        }`}
                      >
                        <MessageSquare
                          className={`chat-sidebar__chat-icon ${
                            activeChat === chat.id
                              ? "chat-sidebar__chat-icon--active"
                              : "chat-sidebar__chat-icon--idle"
                          }`}
                        />
                        <div className="chat-sidebar__chat-meta">
                          <div
                            className={`chat-sidebar__chat-title ${
                              activeChat === chat.id
                                ? "chat-sidebar__chat-title--active"
                                : "chat-sidebar__chat-title--idle"
                            }`}
                          >
                            {chat.title}
                          </div>
                          <div className="chat-sidebar__chat-time">
                            {chat.time}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="chat-sidebar__list-collapsed"
            >
              <button className="chat-sidebar__collapsed-action">
                <Plus className="chat-sidebar__collapsed-action-icon" />
              </button>
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`chat-sidebar__collapsed-item ${
                    activeChat === chat.id
                      ? "chat-sidebar__collapsed-item--active"
                      : "chat-sidebar__collapsed-item--idle"
                  }`}
                >
                  <MessageSquare className="chat-sidebar__collapsed-item-icon" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile */}
      <div className="chat-sidebar__user-wrap">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="user-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="chat-sidebar__user-card"
            >
              <div className="chat-sidebar__avatar">
                <span className="chat-sidebar__avatar-label">JD</span>
              </div>
              <div className="chat-sidebar__user-meta">
                <div className="chat-sidebar__user-name">Nguyen Trung Dat</div>
                <div className="chat-sidebar__user-email">
                  datnguyentrung.ptit@gmail.com
                </div>
              </div>
              <Settings className="chat-sidebar__user-settings" />
            </motion.div>
          ) : (
            <motion.button
              key="user-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="chat-sidebar__user-collapsed"
            >
              <div className="chat-sidebar__avatar">
                <span className="chat-sidebar__avatar-label">JD</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
