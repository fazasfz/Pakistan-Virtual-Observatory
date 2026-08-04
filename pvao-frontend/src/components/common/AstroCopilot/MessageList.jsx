import React, { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import styles from './AstroCopilotPopup.module.css';

export default function MessageList({ messages, isLoading, isOpen }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  return (
    <div className={styles.messagesArea}>
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.messageUser : styles.messageAi}`}
        >
          <div className={styles.avatar}>
            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          <div className={`${styles.messageBubble} ${msg.limited || msg.error ? styles.messageLimited : ''}`}>
            {msg.text}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className={`${styles.messageWrapper} ${styles.messageAi}`}>
          <div className={styles.avatar}>
            <Bot size={16} />
          </div>
          <div className={`${styles.messageBubble} ${styles.messageLoading}`}>
            <span className={styles.dot}>.</span><span className={styles.dot}>.</span><span className={styles.dot}>.</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
