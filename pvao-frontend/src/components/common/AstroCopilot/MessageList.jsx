import React, { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

import { Spin } from 'antd';
import ReactMarkdown from 'react-markdown';
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
            {msg.sender === 'user' ? (
              <User size={16} />
            ) : (
              <Bot size={16} />
            )}
          </div>
          <div className={`${styles.messageBubble} ${msg.limited || msg.error ? styles.messageLimited : ''}`}>
            {msg.sender === 'ai' ? (
              <ReactMarkdown 
                components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brass)', textDecoration: 'underline' }} />
                }}
              >
                {msg.text}
              </ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className={`${styles.messageWrapper} ${styles.messageAi}`}>
          <div className={styles.avatar}>
            <Bot size={16} />
          </div>
          <div className={`${styles.messageBubble} ${styles.messageLoading}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Spin size="small" /> <span>Thinking...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
