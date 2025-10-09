import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getImageUrl,
  getMovieVideos,
} from "../services/movieService";
import ModalTrailer from "../components/ModalTrailer";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [youtubeKey, setYoutubeKey] = useState("");
  const [openVideo, setOpenVideo] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleOpenTrailer = async () => {
    const videos = await getMovieVideos(id);
    // Ưu tiên trailer YouTube, nếu không có thì lấy video đầu tiên
    let trailer = videos.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );
    if (!trailer && videos.length > 0) trailer = videos[0];
    if (trailer && trailer.site === "YouTube" && trailer.key) {
      setYoutubeKey(trailer.key);
      setOpenTrailer(true);
    } else {
      alert("Không tìm thấy trailer YouTube cho phim này!");
    }
  };

  // Modal xem phim
  const VideoModal = ({ open, onClose }) => {
    // Tự động xoay màn hình khi mở modal video trên mobile
    useEffect(() => {
      if (open && window.screen.orientation && window.screen.orientation.lock) {
        window.screen.orientation.lock("landscape").catch(() => {});
      }
      if (
        !open &&
        window.screen.orientation &&
        window.screen.orientation.lock
      ) {
        window.screen.orientation.lock("portrait").catch(() => {});
      }
      // Khi unmount modal, trả về portrait
      return () => {
        if (window.screen.orientation && window.screen.orientation.lock) {
          window.screen.orientation.lock("portrait").catch(() => {});
        }
      };
    }, [open]);

    if (!open) return null;

    return (
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.85)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#111",
            borderRadius: 16,
            padding: 16,
            position: "relative",
            width: "90vw",
            maxWidth: 900,
          }}
        >
          {/* Nếu là phim Conan thì phát video Bunny.net, hoặc Doraemon */}
          {movie &&
          movie.title === "Thám Tử Lừng Danh Conan: Nàng Dâu Halloween" ? (
            <video
              width="100%"
              height="500"
              controls
              autoPlay
              style={{ borderRadius: 12, background: "#000", maxHeight: 500 }}
            >
              <source
                src="https://myvideocpm.b-cdn.net/conan_halloween_fixed.mp4"
                type="video/mp4"
              />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          ) : movie &&
            movie.title === "Thám Tử Lừng Danh Conan: Tiền Đạo Thứ 11" ? (
            <video
              width="100%"
              height="500"
              controls
              autoPlay
              style={{ borderRadius: 12, background: "#000", maxHeight: 500 }}
            >
              <source
                src="https://myvideo3.b-cdn.net/Th%C3%A1m%20T%E1%BB%AD%20L%E1%BB%ABng%20Danh%20Conan%2016-%20Ti%E1%BB%81n%20%C4%90%E1%BA%A1o%20Th%E1%BB%A9%2011%20-%20Detective%20Conan%20Movie%2016-%20The%20Eleventh%20Striker.mp4"
                type="video/mp4"
              />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          ) : null}
        </div>
      </div>
    );
  };

  if (loading)
    return <div style={{ color: "#666", padding: 40 }}>Đang tải...</div>;
  if (!movie)
    return (
      <div style={{ color: "#e74c3c", padding: 40 }}>Không tìm thấy phim!</div>
    );

  // Responsive styles
  const isMobile = window.matchMedia("(max-width: 700px)").matches;
  const detailStyles = {
    container: {
      minHeight: "100vh",
      background: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.85)), url(${getImageUrl(
        movie.backdrop_path || movie.poster_path,
        "w780"
      )}) center/cover no-repeat`,
      color: "#fff",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      padding: isMobile ? "16px" : "60px",
      gap: isMobile ? "24px" : "60px",
    },
    img: {
      width: isMobile ? "100%" : 320,
      maxWidth: 400,
      borderRadius: 16,
      boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      background: "#222",
      margin: isMobile ? "0 auto" : undefined,
      display: "block",
    },
    info: {
      maxWidth: isMobile ? "100%" : 600,
      width: "100%",
    },
    title: {
      fontSize: isMobile ? 24 : 40,
      marginBottom: 20,
      wordBreak: "break-word",
    },
    rating: {
      fontSize: isMobile ? 16 : 22,
      marginBottom: 20,
    },
    overview: {
      fontSize: isMobile ? 14 : 18,
      marginBottom: 30,
      wordBreak: "break-word",
    },
    btnRow: {
      display: "flex",
      gap: isMobile ? 8 : 12,
      flexWrap: isMobile ? "wrap" : "nowrap",
    },
  };

  return (
    <div style={detailStyles.container}>
      <ModalTrailer
        open={openTrailer}
        onClose={() => setOpenTrailer(false)}
        youtubeKey={youtubeKey}
      />
      <VideoModal open={openVideo} onClose={() => setOpenVideo(false)} />
      <img
        src={getImageUrl(movie.poster_path, "w500")}
        alt={movie.title}
        style={detailStyles.img}
      />
      <div style={detailStyles.info}>
        <h1 style={detailStyles.title}>{movie.title}</h1>
        <div style={detailStyles.rating}>
          ⭐ {movie.vote_average} | {movie.release_date}
        </div>
        <p style={detailStyles.overview}>{movie.overview}</p>
        <div style={detailStyles.btnRow}>
          {movie.title === "Thám Tử Lừng Danh Conan: Nàng Dâu Halloween" ||
          movie.title === "Thám Tử Lừng Danh Conan: Tiền Đạo Thứ 11" ? (
            <button onClick={() => setOpenVideo(true)}>Xem phim</button>
          ) : (
            <button onClick={() => navigate(`/watch/${movie.id}`)}>
              Xem phim
            </button>
          )}
          <button onClick={handleOpenTrailer}>Trailer</button>
          <button onClick={() => navigate(-1)}>Quay lại</button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
