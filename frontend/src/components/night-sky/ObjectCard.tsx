// ObjectCard.tsx – displays a night‑sky object in a card with a fade‑up animation
import React from 'react';
import { Card, Badge } from 'antd';
import { motion } from 'framer-motion';
import './objectCard.css';

export interface NightSkyObject {
  object_id: string;
  name: string;
  category: string;
  description: string;
  visibility?: { visible_now?: boolean };
  pakistan_note?: string;
  timing_rule?: unknown;
  alt?: number;
  az?: number;
  ra?: number;
  dec?: number;
  magnitude?: number;
  [key: string]: unknown;
}

interface ObjectCardProps {
  data: NightSkyObject;
  onClick: (obj: NightSkyObject) => void;
}

const fadeUp = {
  whileInView: { opacity: [0, 1], y: [20, 0] },
  transition: { duration: 0.5 },
};

const ObjectCard: React.FC<ObjectCardProps> = ({ data, onClick }) => {
  const { name, category, description, visibility } = data;
  const showBadge = visibility?.visible_now;

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'planet': return '#38bdf8';
      case 'moon': return '#c084fc';
      case 'constellation': return '#fde047';
      default: return '#94a3b8';
    }
  };

  const badgeColor = getCategoryColor(category);

  return (
    <motion.div {...fadeUp} style={{ width: '100%' }}>
      <Card
        className="night-sky-object-card"
        hoverable
        onClick={() => onClick(data)}
        bordered={false}
        actions={showBadge ? [<Badge key="visible" status="success" text={<span style={{ color: '#fff' }}>Visible Now</span>} />] : []}
      >
        <div style={{ 
          display: 'inline-block',
          background: 'rgba(56, 189, 248, 0.1)', 
          color: badgeColor,
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '8px',
          textTransform: 'capitalize'
        }}>
          {category}
        </div>
        <Card.Meta
          title={name}
          description={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {description}
              </span>
              {(data.alt !== undefined || data.magnitude !== undefined) && (
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  {data.alt !== undefined && <span>Alt/Az: {data.alt}°/{data.az}°</span>}
                  {data.magnitude !== undefined && data.magnitude !== null && <span>Mag: {data.magnitude}</span>}
                </div>
              )}
            </div>
          }
        />
      </Card>
    </motion.div>
  );
};

export default ObjectCard;
