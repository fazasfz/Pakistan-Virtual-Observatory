import React, { useState } from 'react';
import { useCopilotState } from './AstroCopilotPopup.hooks';
import AstroCopilotTrigger from './AstroCopilotTrigger';
import AstroCopilotPopup from './AstroCopilotPopup';

export const AstroCopilot = () => {
  const { isOpen, setIsOpen, messages, sendMessage } = useCopilotState();

  return (
    <>
      <AstroCopilotTrigger onClick={() => setIsOpen(true)} />
      <AstroCopilotPopup 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        messages={messages}
        onSendMessage={sendMessage}
      />
    </>
  );
};

export default AstroCopilot;
