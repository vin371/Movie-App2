import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Hls from 'hls.js';

// Map giữa id phim và YouTube Video ID (Unlisted)
const videoMap = {
  "903939": "-EIna3pPUP8",
};

const Watch = () => {
  const { id } = useParams();
  const [customUrl, setCustomUrl] = useState('');
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    // Lấy custom URL nếu có
    try {
      const key = 'customMovieVideos';
      const raw = localStorage.getItem(key);
      const map = raw ? JSON.parse(raw) : {};
      if (map && map[String(id)]) {
        setCustomUrl(map[String(id)]);
      } else {
        setCustomUrl('');
      }
    } catch {}
  }, [id]);

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

  const videoId = videoMap[id];

  return (
    <div style={{ color: '#fff', padding: 40 }}>
      <h1>Xem phim ID: {id}</h1>
      {customUrl ? (
        <video ref={videoRef} controls width="900" height="500" style={{ background: '#000' }} />
      ) : videoId ? (
        <iframe
          width="900"
          height="500"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div style={{ color: 'orange', marginTop: 20 }}>
          Phim này hiện chưa có sẵn trên hệ thống!
        </div>
      )}
    </div>
  );
};

export default Watch;