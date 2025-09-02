import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl, getMovieVideos } from '../services/movieService';
import ModalTrailer from '../components/ModalTrailer';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [openVideo, setOpenVideo] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleOpenTrailer = async () => {
    const videos = await getMovieVideos(id);
    const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer');
    if (trailer) {
      setYoutubeKey(trailer.key);
      setOpenTrailer(true);
    } else {
      alert('Không tìm thấy trailer!!');
    }
  };

  // Modal xem phim
  const VideoModal = ({ open, onClose }) => {
    if (!open) return null;
    return (
      <div
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <div style={{
          background: '#111', borderRadius: 16, padding: 16, position: 'relative',
          width: '90vw', maxWidth: 900
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 10, right: 10, background: '#fff',
              border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontWeight: 'bold'
            }}
          >✖</button>
          <iframe
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/jwS54s9t7gs?autoplay=1&rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{
              borderRadius: 12,
              background: '#000',
            }}
          />
        </div>
      </div>
    );
  };

  if (loading) return <div style={{ color: '#666', padding: 40 }}>Đang tải...</div>;
  if (!movie) return <div style={{ color: '#e74c3c', padding: 40 }}>Không tìm thấy phim!</div>;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.85)), url(${getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}) center/cover no-repeat`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: 60,
        gap: 60,
      }}
    >
      <ModalTrailer open={openTrailer} onClose={() => setOpenTrailer(false)} youtubeKey={youtubeKey} />
      <VideoModal open={openVideo} onClose={() => setOpenVideo(false)} />
      <img
        src={getImageUrl(movie.poster_path, 'w500')}
        alt={movie.title}
        style={{
          width: 320,
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          background: '#222',
        }}
      />
      <div style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: 40, marginBottom: 20 }}>{movie.title}</h1>
        <div style={{ fontSize: 22, marginBottom: 20 }}>
          ⭐ {movie.vote_average} | {movie.release_date}
        </div>
        <p style={{ fontSize: 18, marginBottom: 30 }}>{movie.overview}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          {movie.title === "Thám Tử Lừng Danh Conan: Nàng Dâu Halloween" ? (
            <button onClick={() => setOpenVideo(true)}>Xem phim</button>
          ) : (
            <button onClick={() => navigate(`/watch/${movie.id}`)}>Xem phim</button>
          )}
          <button onClick={handleOpenTrailer}>Trailer</button>
          <button onClick={() => navigate(-1)}>Quay lại</button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;