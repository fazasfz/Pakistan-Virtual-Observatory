import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Button } from 'antd';
import { Send, Bot, User } from 'lucide-react';
import styles from './AstroCopilotPopup.module.css';

const AstroCopilotPopup = ({ isOpen, onClose, messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          <Bot size={20} className={styles.titleIcon} />
          <span>ASTRO-COPILOT</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className={styles.copilotModal}
      wrapClassName={styles.copilotModalWrap}
      width={400}
      mask={false} // Allow interacting with the app behind the popup
      maskClosable={false} // But don't close on clicking outside to keep it persistent while working
    >
      <div className={styles.chatContainer}>
        <div className={styles.messagesArea}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.messageUser : styles.messageAi}`}
            >
              <div className={styles.avatar}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={styles.messageBubble}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className={styles.inputArea}>
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Query observatory data..."
            className={styles.chatInput}
            suffix={
              <Button 
                type="text" 
                icon={<Send size={16} />} 
                onClick={handleSend}
                className={styles.sendBtn}
              />
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default AstroCopilotPopup;
