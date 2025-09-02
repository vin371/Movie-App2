import React from 'react';

const ModalTrailer = ({ open, onClose, youtubeKey }) => {
  if (!open) return null;

  // Hàm xử lý khi click vào overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div style={{ background: '#000', borderRadius: 12, padding: 10, position: 'relative', width: '90vw', maxWidth: 800 }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 10, right: 10, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer'
          }}
        >✖</button>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalTrailer;