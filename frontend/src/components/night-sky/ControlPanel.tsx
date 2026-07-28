// src/components/night-sky/ControlPanel.tsx
import React from 'react';
import { Slider, Switch, Space } from 'antd';
import PremiumButton from '../common/Button';
import './controlPanel.css';

interface ControlPanelProps {
  zoom: number;
  onZoomChange: (value: number) => void;
  telescopeMode: boolean;
  onToggleTelescope: (checked: boolean) => void;
  onClose: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ zoom, onZoomChange, telescopeMode, onToggleTelescope, onClose }) => (
  <div className="control-panel">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontWeight: 'bold', color: '#fff' }}>Controls</span>
      <button 
        onClick={onClose} 
        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}
      >
        &times;
      </button>
    </div>
    <Space direction="vertical" size="middle">
      <div className="control-item">
        <span style={{ color: '#fff' }}>Zoom</span>
        <Slider
          min={5}
          max={30}
          step={1}
          value={zoom}
          onChange={onZoomChange}
          tooltip={{ formatter: (v) => `${v}` }}
        />
      </div>
      <div className="control-item">
        <span style={{ color: '#fff' }}>Telescope Mode</span>
        <Switch checked={telescopeMode} onChange={onToggleTelescope} />
      </div>
      <PremiumButton onClick={() => console.log('Reset view')}>Reset View</PremiumButton>
    </Space>
  </div>
);

export default ControlPanel;
