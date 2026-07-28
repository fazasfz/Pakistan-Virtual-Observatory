// src/components/common/Modal.tsx
import React from 'react';
import { Modal as AntModal } from 'antd';
import './common.css';

type PremiumModalProps = React.ComponentProps<typeof AntModal>;

const PremiumModal: React.FC<PremiumModalProps> = (props) => (
  <AntModal className="premium-modal" {...props} />
);

export default PremiumModal;
