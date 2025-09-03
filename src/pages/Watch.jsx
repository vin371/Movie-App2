import React, { useEffect, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import Hls from 'hls.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-vercel-server.vercel.app';

const Watch = () => {
  const { id } = useParams();
  const [customUrl, setCustomUrl] = useState('');
  const [customMeta, setCustomMeta] = useState(null); // {playbackUrl, assetId, playbackId}
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    // Lấy custom URL nếu có
    try {
      const key = 'customMovieVideos';
      const raw = localStorage.getItem(key);
      const map = raw ? JSON.parse(raw) : {};
      const entry = map && map[String(id)];
      if (entry) {
        if (typeof entry === 'string') {
          setCustomUrl(entry);
          setCustomMeta({ playbackUrl: entry, assetId: null, playbackId: null });
        } else {
          setCustomUrl(entry.playbackUrl);
          setCustomMeta(entry);
        }
      } else {
        setCustomUrl('');
        setCustomMeta(null);
      }
    } catch {}
  }, [id]);

  // Thêm polling kiểm tra trạng thái playback
  useEffect(() => {
    if (!customMeta?.assetId && !customMeta?.playbackId) return;
    let interval;
    const checkPlayback = async () => {
      try {
        const url = customMeta?.assetId
          ? `${API_BASE_URL}/api/mux-playback-by-asset/${customMeta.assetId}`
          : customMeta?.playbackId
          ? `${API_BASE_URL}/api/mux-playback/${customMeta.playbackId}`
          : null;
        if (!url) return;
        const res = await fetch(url);
        const data = await res.json();
        if (data.playbackUrl) {
          setCustomUrl(data.playbackUrl);
        } else if (data.processing) {
          // Asset chưa sẵn sàng, tiếp tục polling
        }
      } catch {}
    };
    interval = setInterval(checkPlayback, 4000);
    return () => clearInterval(interval);
  }, [customMeta]);

  useEffect(() => {
    if (!customUrl || !videoRef.current) return;
    const video = videoRef.current;
    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(customUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = customUrl;
    } else {
      video.src = customUrl;
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [customUrl]);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/mux-asset/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
        body: JSON.stringify({ assetId: customMeta?.assetId || null, playbackId: customMeta?.playbackId || null, playbackUrl: customUrl || null })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        alert(data?.error || 'Xóa thất bại. Sai mật khẩu hoặc lỗi máy chủ.');
      } else {
        try {
          const key = 'customMovieVideos';
          const raw = localStorage.getItem(key);
          const map = raw ? JSON.parse(raw) : {};
          delete map[String(id)];
          localStorage.setItem(key, JSON.stringify(map));
        } catch {}
        setCustomUrl('');
        setCustomMeta(null);
      }
    } catch (e) {
      alert('Lỗi kết nối tới server khi xóa.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setAdminPassword('');
    }
  };

  return (
    <div style={{ color: '#fff', padding: 40 }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        Xem phim ID: {id}
        {customUrl && (
          <button
            title="Xóa vĩnh viễn video này (yêu cầu mật khẩu)"
            onClick={() => setShowDeleteModal(true)}
            style={{
              marginLeft: 12,
              background: 'transparent',
              border: '1px solid #ef4444',
              color: '#ef4444',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
            }}
          >
            🗑️ Xóa
          </button>
        )}
      </h1>
      {customUrl ? (
        <>
          <video ref={videoRef} controls width="900" height="500" style={{ background: '#000' }} />
          {showDeleteModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
            }}>
              <div style={{ background: '#fff', color: '#111', padding: 20, borderRadius: 12, minWidth: 320 }}>
                <h3>Nhập mật khẩu để xóa vĩnh viễn</h3>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Mật khẩu quản trị"
                  style={{ width: '100%', marginTop: 10, padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button onClick={() => setShowDeleteModal(false)} style={{ padding: '8px 12px', borderRadius: 8 }}>Hủy</button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleting || !adminPassword}
                    style={{ padding: '8px 12px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none' }}
                  >
                    {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ color: 'orange', marginTop: 20 }}>
          Phim này hiện chưa có sẵn trên hệ thống!
        </div>
      )}
    </div>
  );
};

export default Watch;