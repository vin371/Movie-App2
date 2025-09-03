import React, { useEffect, useRef, useState } from "react";
import VideoUpload from "../components/VideoUpload";
import Hls from "hls.js";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

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

  // Attach HLS when playbackUrl available
  useEffect(() => {
    if (!playbackUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(playbackUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playbackUrl;
    } else {
      // Fallback: just set src
      video.src = playbackUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [playbackUrl]);

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
        alert("Lỗi khi gọi TMDB API! Kiểm tra lại API Key.");
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
    // Persist to localStorage: map movieId -> playbackUrl
    try {
      const key = 'customMovieVideos';
      const raw = localStorage.getItem(key);
      const map = raw ? JSON.parse(raw) : {};
      map[String(confirmMovie.id)] = playbackUrl;
      localStorage.setItem(key, JSON.stringify(map));
    } catch (e) {
      console.warn('Lưu custom video vào localStorage thất bại:', e);
    }
    setConfirmMovie(null);
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
    setUploading(true);
    setProgress(0);
    try {
      const res = await fetch("http://localhost:5000/api/mux-upload", {
        method: "POST",
      });
      const { uploadUrl, uploadId } = await res.json();
      if (!uploadUrl || !uploadId) {
        console.log("Không nhận được uploadUrl hoặc uploadId từ backend:", {
          uploadUrl,
          uploadId,
        });
        setUploading(false);
        return;
      }

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed with status ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      // Start polling using the uploadId returned by backend
      pollPlaybackUrl(uploadId);
    } catch (err) {
      console.log("Lỗi upload video:", err);
      setUploading(false);
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
    <div style={{ padding: 32 }}>
      <h1>Upload Video lên Mux</h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
        <button onClick={resetUpload}>Reset</button>
      </div>
      {uploading && (
        <div>
          <p>Đang xử lý video...</p>
          <div style={{ width: 400, height: 8, background: '#eee', borderRadius: 4 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#3b82f6', borderRadius: 4 }} />
          </div>
          <p>{progress}%</p>
        </div>
      )}

      {playbackUrl && (
        <video ref={videoRef} controls width={400} style={{ background: '#000' }} />
      )}

      {playbackUrl && !showSearch && (
        <div>
          <p>Upload thành công! Video đã sẵn sàng.</p>
          <button onClick={() => setShowSearch(true)}>Tìm phim</button>
        </div>
      )}

      {showSearch && (
        <div style={{ marginTop: 24 }}>
          <h3>Tìm kiếm phim từ TMDB:</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập tên phim..."
            style={{ marginRight: 8 }}
          />
          <button onClick={handleSearch}>Tìm kiếm</button>
          <div style={{ marginTop: 16 }}>
            {searchResults.length === 0 && <p>Không có kết quả.</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
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
                      style={{ width: "100%", borderRadius: 4 }}
                    />
                  )}
                  <div style={{ fontWeight: "bold", marginTop: 8 }}>
                    {movie.title} ({movie.release_date?.slice(0, 4)})
                  </div>
                  <button
                    style={{ marginTop: 8, width: "100%" }}
                    onClick={() => handleAddClick(movie)}
                  >
                    Thêm video này vào phim
                  </button>
                </div>
              ))}
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
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  minWidth: 320,
                }}
              >
                <h3>Xác nhận thêm video vào phim?</h3>
                <p>
                  Bạn có chắc muốn gán video vừa upload vào phim{" "}
                  <b>{confirmMovie.title}</b>?
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                  <button onClick={handleConfirmAdd}>Đồng ý</button>
                  <button onClick={handleCancelAdd}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedMovie && (
        <div style={{ marginTop: 32 }}>
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
  );
}

export default UploadPage;