// src/components/common/Button.tsx
import React from 'react';
import './common.css';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({ children, ...rest }) => (
  <button className="premium-button" {...rest}>
    {children}
  </button>
);

export default PremiumButton;
