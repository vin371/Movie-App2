import React from 'react';
import { useParams } from 'react-router-dom';

// Map giữa id phim và YouTube Video ID (Unlisted)
const videoMap = {
  "903939": "-EIna3pPUP8", // Đã thay bằng ID YouTube mới của bạn
  // Thêm các phim khác nếu cần
};

const Watch = () => {
  const { id } = useParams();
  const videoId = videoMap[id];

  return (
    <div style={{ color: '#fff', padding: 40 }}>
      <h1>Xem phim ID: {id}</h1>
      {videoId ? (
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