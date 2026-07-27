// src/components/common/Card.tsx
import React from 'react';
import { Card as AntCard } from 'antd';
import './common.css';

interface PremiumCardProps extends React.ComponentProps<typeof AntCard> {
  children: React.ReactNode;
}

const PremiumCard: React.FC<PremiumCardProps> = ({ children, ...rest }) => (
  <AntCard className="premium-card" {...rest}>
    {children}
  </AntCard>
);

export default PremiumCard;
