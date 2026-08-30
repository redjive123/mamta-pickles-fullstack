import React from 'react';
import { X, ShieldCheck, Truck, Gift, FileText, Mail } from 'lucide-react';

export const InfoModal = ({ modalData, onClose }) => {
  if (!modalData) return null;

  const { title, icon, content } = modalData;

  const iconsMap = {
    shipping: <Truck size={28} style={{ color: '#d97706' }} />,
    bulk: <Gift size={28} style={{ color: '#d97706' }} />,
    guarantee: <ShieldCheck size={28} style={{ color: '#d97706' }} />,
    policy: <FileText size={28} style={{ color: '#d97706' }} />,
    contact: <Mail size={28} style={{ color: '#d97706' }} />,
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 580, padding: 32 }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', color: '#8c8275' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          {iconsMap[icon] || iconsMap.policy}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b18', margin: 0 }}>
            {title}
          </h2>
        </div>

        <div
          style={{
            fontSize: '0.9rem',
            color: '#655d54',
            lineHeight: 1.6,
            backgroundColor: '#faf7f2',
            border: '1px solid #e5e0d8',
            borderRadius: 12,
            padding: 20,
            maxHeight: 360,
            overflowY: 'auto',
          }}
        >
          {content}
        </div>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
