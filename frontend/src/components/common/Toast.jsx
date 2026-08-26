import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle style={{ color: '#16a34a', minWidth: 20 }} />,
    error: <AlertCircle style={{ color: '#dc2626', minWidth: 20 }} />,
    info: <Info style={{ color: '#d97706', minWidth: 20 }} />,
  };

  return (
    <div
      className="animate-fade"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 2000,
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        borderRadius: 12,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: '1px solid #e5e0d8',
        maxWidth: 380,
      }}
    >
      {icons[type]}
      <span style={{ fontSize: '0.9rem', color: '#1e1b18', fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          padding: 4,
          color: '#8c8275',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
