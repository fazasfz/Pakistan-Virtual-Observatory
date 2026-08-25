import { useState } from 'react';
import { fetchAstroCopilotStream } from './astroCopilotApi';
import { useAstroCopilotContext } from '../../../context/AstroCopilotContext';

export const useCopilotState = () => {
  const { isOpen, setIsOpen } = useAstroCopilotContext();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Astro-Copilot online. How can I assist with your observations today?' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsgId = Date.now();
    const aiMsgId = userMsgId + 1;

    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setIsLoading(true);

    try {
      const response = await fetchAstroCopilotStream(text);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported on response body.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '' }]);
      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMsgId ? { ...msg, text: msg.text + chunk } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Copilot API error:', error);
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === aiMsgId);
        if (exists) {
          return prev.map(msg =>
            msg.id === aiMsgId && !msg.text
              ? {
                  ...msg,
                  text: 'Astro-Copilot central API is unreachable. Please verify the service is running and try again.',
                  error: true,
                }
              : msg
          );
        }
        return [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            text: 'Astro-Copilot central API is unreachable. Please verify the service is running and try again.',
            error: true,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isOpen, setIsOpen, messages, sendMessage, isLoading };
};
