import { useState } from 'react';
import { askAstroCopilot } from './astroCopilotApi';

export const useCopilotState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Astro-Copilot online. How can I assist with your observations today?' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setIsLoading(true);
    
    try {
      const response = await askAstroCopilot(text);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: response.answer,
        limited: response.limited
      }]);
    } catch (error) {
      console.error('Copilot API error:', error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: 'Astro-Copilot is temporarily unavailable. Please try again shortly.',
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { isOpen, setIsOpen, messages, sendMessage, isLoading };
};
