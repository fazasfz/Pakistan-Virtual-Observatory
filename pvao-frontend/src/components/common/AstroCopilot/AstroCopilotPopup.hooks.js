import { useState } from 'react';

export const useCopilotState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Astro-Copilot online. How can I assist with your observations today?' }
  ]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    
    // Simulate AI response for now
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'I am a placeholder intelligence. Connect me to the backend module to process your request.' }]);
    }, 1000);
  };

  return { isOpen, setIsOpen, messages, sendMessage };
};
