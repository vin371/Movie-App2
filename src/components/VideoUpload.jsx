import React, { useState } from "react";

const VideoUpload = ({ onVideoUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [waitingMux, setWaitingMux] = useState(false);
  const [assetId, setAssetId] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setProgress(0);
  };

  const pollPlaybackUrl = async (uploadId, fileName) => {
    setWaitingMux(true);
    let playbackUrl = null;
    let tries = 0;
    while (tries < 40 && !playbackUrl) {
      tries++;
      await new Promise((r) => setTimeout(r, 3000));
      const res2 = await fetch(
        `http://localhost:5000/api/mux-playback/${uploadId}`
      );
      const data2 = await res2.json();
      if (data2.playbackUrl) {
        playbackUrl = data2.playbackUrl;
        break;
      }
    }
    setWaitingMux(false);
    if (playbackUrl) {
      setMessage("Video đã sẵn sàng để xem!");
      if (onVideoUploaded) onVideoUploaded(fileName, playbackUrl);
    } else {
      setMessage("Video đang được xử lý trên Mux, vui lòng thử lại sau!!");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Vui lòng chọn file video!");
      return;
    }
    setUploading(true);
    setMessage("Đang lấy upload URL...");

    try {
      const res = await fetch("http://localhost:5000/api/mux-upload", {
        method: "POST",
      });
      const data = await res.json();
      if (!data.uploadUrl || !data.uploadId)
        throw new Error("Không lấy được upload URL!");

      setMessage("Đang upload video...");
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", data.uploadUrl, true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          setMessage("Upload thành công! Video đang được xử lý trên Mux...");
          setIsUploaded(true);
          pollPlaybackUrl(data.uploadId, file.name); // Tự động polling
        } else {
          setMessage("Upload thất bại!");
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setMessage("Có lỗi khi upload!");
      };

      xhr.send(file);
    } catch (err) {
      setUploading(false);
      setMessage("Lỗi: " + err.message);
      console.error("Upload error:", err);
    }
  };

  const handleGetPlayback = async () => {
    if (!assetId) return;
    const res = await fetch(
      `http://localhost:5000/api/mux-playback-by-asset/${assetId}`
    );
    const data = await res.json();
    if (data.playbackUrl) {
      setMessage("Video đã sẵn sàng để xem!");
      if (onVideoUploaded) onVideoUploaded("Mux Asset", data.playbackUrl);
    } else {
      setMessage("Không lấy được playback URL!");
    }
  };

  return (
    <div
      style={{
        margin: 24,
        padding: 16,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Upload Video lên Mux</h2>
      {!isUploaded ? (
        <>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            style={{ marginLeft: 8 }}
          >
            {uploading ? "Đang upload..." : "Upload"}
          </button>
        </>
      ) : (
        <div>
          <p>Upload thành công! Video đang được xử lý trên Mux...</p>
          {waitingMux && <p>Đang kiểm tra trạng thái video...</p>}
        </div>
      )}
      {progress > 0 && <div>Tiến độ: {progress}%</div>}
      <div style={{ marginTop: 24 }}>
        <h4>Lấy video từ Asset ID Mux (nếu asset đã Ready):</h4>
        <input
          type="text"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          placeholder="Nhập Asset ID từ Mux dashboard"
          style={{ marginRight: 8 }}
        />
        <button onClick={handleGetPlayback}>Lấy video</button>
      </div>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  );
};

export default VideoUpload;
