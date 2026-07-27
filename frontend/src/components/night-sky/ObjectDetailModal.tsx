import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NightSkyObject } from './ObjectCard';
import './objectDetailModal.css';

interface ObjectDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: NightSkyObject | null;
}

export const ObjectDetailModal: React.FC<ObjectDetailModalProps> = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="custom-modal-overlay" onClick={onClose}>
          <motion.div
            className="custom-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="custom-modal-close" onClick={onClose}>&times;</button>
            <h2 className="custom-modal-title">{String(data.name)}</h2>
            <div className="custom-modal-category">{String(data.category)}</div>
            
            <p className="custom-modal-desc">{String(data.description)}</p>
            
            {data.pakistan_note && (
              <div className="custom-modal-note">
                <strong>Local Note: </strong> {String(data.pakistan_note)}
              </div>
            )}

            <div className="custom-modal-astrometric">
              <strong style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Astrometric Data</strong>
              <div className="timing-badges">
                {data.alt !== undefined && data.az !== undefined && (
                  <div className="timing-badge">
                    <span className="timing-key">Alt / Az:</span> 
                    <span className="timing-val">{data.alt}° / {data.az}°</span>
                  </div>
                )}
                {data.ra !== undefined && data.dec !== undefined && (
                  <div className="timing-badge">
                    <span className="timing-key">RA / Dec:</span> 
                    <span className="timing-val">{data.ra}° / {data.dec}°</span>
                  </div>
                )}
                {data.magnitude !== undefined && data.magnitude !== null && (
                  <div className="timing-badge">
                    <span className="timing-key">Magnitude:</span> 
                    <span className="timing-val">{data.magnitude}</span>
                  </div>
                )}
                {data.rise_set_time !== undefined && data.rise_set_time !== null && (
                  <div className="timing-badge">
                    <span className="timing-key">Rise/Set:</span> 
                    <span className="timing-val">{String(data.rise_set_time)}</span>
                  </div>
                )}
              </div>
            </div>

            {!!data.timing_rule && typeof data.timing_rule === 'object' && (
              <div className="custom-modal-timing" style={{ marginTop: '16px' }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Timing Data</strong>
                <div className="timing-badges">
                  {Object.entries(data.timing_rule).map(([key, val]) => (
                    <div key={key} className="timing-badge">
                      <span className="timing-key">{key.replace(/_/g, ' ')}:</span> 
                      <span className="timing-val">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
