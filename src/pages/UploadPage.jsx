import React, { useEffect, useRef, useState } from "react";
import VideoUpload from "../components/VideoUpload";
import Hls from "hls.js";
import { useNavigate } from "react-router-dom";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UploadPage() {
  const [assetId, setAssetId] = useState("");
  const [playbackUrl, setPlaybackUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [confirmMovie, setConfirmMovie] = useState(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });
  const lastPlaybackIdRef = useRef("");
  const [addedMap, setAddedMap] = useState({});
  const navigate = useNavigate();

  // Restore last successful upload on reload
  useEffect(() => {
    try {
      const raw = localStorage.getItem('lastUpload');
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.playbackUrl) setPlaybackUrl(saved.playbackUrl);
        if (saved?.assetId) setAssetId(saved.assetId);
      }
    } catch {}
    try {
      const rawMap = localStorage.getItem('customMovieVideos');
      setAddedMap(rawMap ? JSON.parse(rawMap) : {});
    } catch { setAddedMap({}); }
  }, []);

  // Simple UI styles
  const styles = {
    page: {
      padding: 32,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
    },
    card: {
      maxWidth: 920,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
    },
    title: {
      fontSize: 28,
      fontWeight: 800,
      color: '#1f2937',
      marginBottom: 16,
    },
    row: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '10px 16px',
      borderRadius: 10,
      cursor: 'pointer',
      boxShadow: '0 6px 18px rgba(118,75,162,0.25)'
    },
    btnGhost: {
      background: 'rgba(0,0,0,0.04)',
      color: '#111827',
      border: '1px solid rgba(0,0,0,0.08)',
      padding: '10px 16px',
      borderRadius: 10,
      cursor: 'pointer'
    },
    progressWrap: {
      width: '100%',
      maxWidth: 520,
      height: 10,
      background: '#eef2ff',
      borderRadius: 999,
      overflow: 'hidden',
      border: '1px solid #e5e7eb'
    },
    progressBar: (p) => ({
      width: `${p}%`,
      height: '100%',
      background: 'linear-gradient(90deg, #60a5fa, #6366f1)',
      transition: 'width .2s ease',
    }),
    toast: (type) => ({
      position: 'fixed',
      top: 20,
      right: 20,
      padding: '12px 16px',
      borderRadius: 10,
      color: type === 'error' ? '#991b1b' : '#065f46',
      background: type === 'error' ? '#fee2e2' : '#d1fae5',
      border: `1px solid ${type === 'error' ? '#fecaca' : '#a7f3d0'}`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      zIndex: 10000
    })
  };

  // Attach HLS when playbackUrl available
  useEffect(() => {
    if (!playbackUrl || !videoRef.current) return;

    const video = videoRef.current;

    // Cleanup prev hls
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const autoPlay = () => {
      try { video.play().catch(() => {}); } catch {}
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        // Listen for 412 and retry with signed URL
        xhrSetup: (xhr, url) => {
          const onReadyStateChange = () => {
            if (xhr.readyState === 4 && xhr.status === 412) {
              const trySignedByPlayback = async () => {
                try {
                  const r = await fetch(`http://localhost:5000/api/mux-signed-playback/${lastPlaybackIdRef.current}`);
                  if (!r.ok) return;
                  const j = await r.json();
                  if (j.playbackUrl) setPlaybackUrl(j.playbackUrl);
                } catch {}
              };
              const trySignedByAsset = async () => {
                try {
                  const r = await fetch(`http://localhost:5000/api/mux-signed-playback-by-asset/${assetId}`);
                  if (!r.ok) return;
                  const j = await r.json();
                  if (j.playbackUrl) {
                    setPlaybackUrl(j.playbackUrl);
                    if (j.playbackId) lastPlaybackIdRef.current = j.playbackId;
                  }
                } catch {}
              };
              if (lastPlaybackIdRef.current) trySignedByPlayback();
              else if (assetId) trySignedByAsset();
            }
          };
          xhr.addEventListener('readystatechange', onReadyStateChange);
        },
      });
      hlsRef.current = hls;
      hls.loadSource(playbackUrl);
      hls.attachMedia(video);
      video.addEventListener('canplay', autoPlay, { once: true });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playbackUrl;
      video.addEventListener('canplay', autoPlay, { once: true });
    } else {
      video.src = playbackUrl;
      video.addEventListener('canplay', autoPlay, { once: true });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [playbackUrl, assetId]);

  const handleVideoUploaded = (fileName, playbackUrl) => {
    setUploadedVideo({ fileName, playbackUrl });
    setShowSearch(true);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setSearchResults([]);
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
          searchQuery
        )}&language=vi`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
            accept: "application/json",
          },
        }
      );
      if (!res.ok) {
        alert("Lỗi khi gọi TMDB API! Kiểm tra lại API Key.")
        return;
      }
      const data = await res.json();
      setSearchResults(data.results || []);
      if (!data.results || data.results.length === 0) {
        alert("Không tìm thấy phim nào!");
      }
    } catch (err) {
      alert("Có lỗi khi tìm kiếm phim!");
      console.error(err);
    }
  };

  const handleAddClick = (movie) => {
    setConfirmMovie(movie);
  };

  const handleConfirmAdd = () => {
    setSelectedMovie({ ...confirmMovie, videoUrl: playbackUrl });
    // Persist to localStorage: map movieId -> { playbackUrl, assetId, playbackId }
    try {
      const key = 'customMovieVideos';
      const raw = localStorage.getItem(key);
      const map = raw ? JSON.parse(raw) : {};
      map[String(confirmMovie.id)] = {
        playbackUrl,
        assetId: assetId || null,
        playbackId: lastPlaybackIdRef.current || null,
      };
      localStorage.setItem(key, JSON.stringify(map));
      setAddedMap(map);
      setToast({ visible: true, type: 'success', message: 'Thêm video vào phim thành công!' });
      // Điều hướng xem ngay
      navigate(`/watch/${confirmMovie.id}`);
    } catch (e) {
      console.warn('Lưu custom video vào localStorage thất bại:', e);
      setToast({ visible: true, type: 'error', message: 'Thêm thất bại! Vui lòng thử lại.' });
    }
    setConfirmMovie(null);
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  const handleCancelAdd = () => {
    setConfirmMovie(null);
  };

  const resetUpload = () => {
    setProgress(0);
    setUploading(false);
    setPlaybackUrl("");
    setAssetId("");
    setShowSearch(false);
    setSelectedMovie(null);
    setConfirmMovie(null);
    try { localStorage.removeItem('lastUpload'); } catch {}
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  };

  // Hàm upload video lên Mux (với progress)
  async function handleUpload(file) {
    const formData = new FormData();
    formData.append('video', file);

    console.log('Upload to:', `${API_BASE_URL}/api/mux-upload`);
    try {
      const res = await fetch(`${API_BASE_URL}/api/mux-upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('Upload response:', data);
      // Xử lý kết quả ở đây
    } catch (err) {
      console.error('Upload error:', err);
    }
  }

  // Polling asset status with fallback to assetId if provided by server
  async function pollPlaybackUrl(id) {
    let tries = 0;
    const maxTries = 40;
    let useAsset = false;
    let currentId = id;

    const interval = setInterval(async () => {
      tries++;
      try {
        const url = useAsset
          ? `http://localhost:5000/api/mux-playback-by-asset/${currentId}`
          : `http://localhost:5000/api/mux-playback/${currentId}`;
        const res = await fetch(url);
        if (!res.ok) {
          const txt = await res.text();
          console.warn("Playback resolve failed:", res.status, txt);
        }
        const data = await res.json().catch(() => ({}));
        if (data.playbackUrl) {
          setPlaybackUrl(data.playbackUrl);
          if (data.assetId) setAssetId(data.assetId);
          if (data.playbackId) lastPlaybackIdRef.current = data.playbackId;
          try { localStorage.setItem('lastUpload', JSON.stringify({ assetId: data.assetId || assetId, playbackUrl: data.playbackUrl })); } catch {}
          clearInterval(interval);
          setUploading(false);
          return;
        }
        // If server revealed assetId, switch to resolving by asset
        if (!useAsset && data.assetId) {
          useAsset = true;
          currentId = data.assetId;
        }
      } catch (err) {
        console.log("Lỗi lấy playbackUrl:", err);
      }
      if (tries >= maxTries) {
        console.log("Quá số lần thử, không lấy được playbackUrl");
        clearInterval(interval);
        setUploading(false);
      }
    }, 3000);
  }

  return (
    <div style={styles.page}>
      {toast.visible && (
        <div style={styles.toast(toast.type)}>
          {toast.message}
        </div>
      )}
      <div style={styles.card}>
        <div style={styles.title}>Upload Video</div>
        <div style={styles.row}>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          <button onClick={resetUpload} style={styles.btnGhost}>Hủy</button>
        </div>
        {uploading && (
          <div style={{ marginTop: 16 }}>
            <p style={{ margin: '6px 0', color: '#374151' }}>Đang xử lý video...</p>
            <div style={styles.progressWrap}>
              <div style={styles.progressBar(progress)} />
            </div>
            <p style={{ marginTop: 6, color: '#6b7280' }}>{progress}%</p>
          </div>
        )}

        {playbackUrl && !selectedMovie && (
          <div style={{ marginTop: 20 }}>
            <video ref={videoRef} controls width={600} style={{ background: '#000', borderRadius: 12 }} />
          </div>
        )}

        {playbackUrl && !showSearch && (
          <div style={{ marginTop: 16 }}>
            <p>Upload thành công! Video đã sẵn sàng.</p>
            <button onClick={() => setShowSearch(true)} style={styles.btnPrimary}>Tìm phim</button>
          </div>
        )}

        {showSearch && (
          <div style={{ marginTop: 24 }}>
            <h3>Tìm kiếm phim từ TMDB:</h3>
            <div style={styles.row}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên phim..."
                style={{ marginRight: 8, padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb' }}
              />
              <button onClick={handleSearch} style={styles.btnPrimary}>Tìm kiếm</button>
            </div>
            <div style={{ marginTop: 16 }}>
              {searchResults.length === 0 && <p>Không có kết quả.</p>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {searchResults.map((movie) => {
                  const already = !!addedMap[String(movie.id)];
                  return (
                    <div
                      key={movie.id}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: 12,
                        width: 220,
                        background: "#fafafa",
                        position: "relative",
                      }}
                    >
                      {movie.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                          alt={movie.title}
                          style={{ width: "100%", borderRadius: 8 }}
                        />
                      )}
                      <div style={{ fontWeight: "bold", marginTop: 8 }}>
                        {movie.title} ({movie.release_date?.slice(0, 4)})
                      </div>
                      <button
                        style={{ marginTop: 8, width: "100%", ...(already ? {} : styles.btnPrimary) }}
                        onClick={() => !already && handleAddClick(movie)}
                        disabled={already}
                      >
                        {already ? 'Đã thêm' : 'Thêm video này vào phim'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            {confirmMovie && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999,
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    padding: 24,
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    minWidth: 320,
                  }}
                >
                  <h3>Xác nhận thêm video vào phim?</h3>
                  <p>
                    Bạn có chắc muốn gán video vừa upload vào phim{" "}
                    <b>{confirmMovie.title}</b>?
                  </p>
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button onClick={handleConfirmAdd} style={styles.btnPrimary}>Đồng ý</button>
                    <button onClick={handleCancelAdd} style={styles.btnGhost}>Hủy</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedMovie && (
          <div style={{ marginTop: 24 }}>
            <h2>{selectedMovie.title}</h2>
            <video
              src={selectedMovie.videoUrl}
              controls
              width="600"
              style={{ borderRadius: 8 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;