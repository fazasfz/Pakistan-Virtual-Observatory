import React from 'react';
import { Typography, Spin } from 'antd';
import StarCard from './StarCard';
import type { NightSkyObject } from './ObjectCard';
import './sidePanel.css';

const { Title } = Typography;

interface SidePanelProps {
  objects: NightSkyObject[];
  loading: boolean;
  selectedObj: NightSkyObject | null;
  hoveredObj: NightSkyObject | null;
  onSelect: (obj: NightSkyObject) => void;
  onHover: (obj: NightSkyObject | null) => void;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ objects, loading, selectedObj, hoveredObj, onSelect, onHover, onClose }) => {
  return (
    <div className="side-panel">
      <div className="side-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>Observed Objects</Title>
        <button 
          onClick={onClose} 
          style={{ background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', fontSize: '20px' }}
        >
          &times;
        </button>
      </div>
      <div className="side-panel-content">
        <Spin spinning={loading} tip="Loading objects..." style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {objects.map((obj) => (
              <div 
                key={obj.object_id} 
                onMouseEnter={() => onHover(obj)}
                onMouseLeave={() => onHover(null)}
                style={{
                  border: (selectedObj?.object_id === obj.object_id) 
                            ? '1px solid #4488ff' 
                            : (hoveredObj?.object_id === obj.object_id) 
                                ? '1px solid rgba(68, 136, 255, 0.5)' 
                                : '1px solid transparent',
                  borderRadius: '12px',
                  transition: 'border 0.3s ease'
                }}
              >
                <StarCard data={obj} onClick={onSelect} />
              </div>
            ))}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default SidePanel;
