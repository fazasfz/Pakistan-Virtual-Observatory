import React from 'react';
import { Modal } from 'antd';
import { Bot } from 'lucide-react';

import styles from './AstroCopilotPopup.module.css';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const AstroCopilotPopup = ({ isOpen, onClose, messages, onSendMessage, isLoading }) => {
  const { isMobile } = useBreakpoint();

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          <div className={styles.titleIcon}><Bot size={20} /></div>
          <span>ASTRO-COPILOT</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className={`${styles.copilotModal} ${isMobile ? 'copilotModalMobile' : ''}`}
      wrapClassName={styles.copilotModalWrap}
      width={400}
      mask={false}
    >
      <div className={styles.chatContainer}>
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          isOpen={isOpen} 
        />
        <ChatInput 
          onSendMessage={onSendMessage} 
          isLoading={isLoading} 
        />
      </div>
    </Modal>
  );
};

export default AstroCopilotPopup;
