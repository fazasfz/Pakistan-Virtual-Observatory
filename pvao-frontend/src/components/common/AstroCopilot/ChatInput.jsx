import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Send } from 'lucide-react';
import styles from './AstroCopilotPopup.module.css';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
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
    <div className={styles.inputArea}>
      <Input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Query observatory data..."
        disabled={isLoading}
        className={styles.chatInput}
        suffix={
          <Button 
            type="text" 
            icon={<Send size={16} />} 
            onClick={handleSend}
            disabled={isLoading}
            className={styles.sendBtn}
          />
        }
      />
    </div>
  );
}
