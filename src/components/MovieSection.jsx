import React from "react";
import { getImageUrl } from "../services/movieService";
import { useNavigate } from "react-router-dom";

const MovieSection = ({ title, movies }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 700);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  const sectionStyles = {
    container: {
      marginBottom: "60px",
    },
    title: {
      color: "#333",
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "30px",
      textAlign: "center",
      position: "relative",
    },
    titleUnderline: {
      width: "80px",
      height: "4px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      margin: "10px auto 0",
      borderRadius: "2px",
    },
    moviesGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(250px, 1fr))",
      gap: isMobile ? "16px" : "30px",
      padding: isMobile ? "0 4px" : "0 20px",
    },
    movieCard: {
      background: "white",
      borderRadius: isMobile ? "10px" : "15px",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    movieImage: {
      width: "100%",
      height: isMobile ? "180px" : "300px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "#666",
      position: "relative",
      overflow: "hidden",
    },
    movieInfo: {
      padding: "20px",
    },
    movieTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "8px",
      lineHeight: "1.3",
    },
    movieYear: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "10px",
    },
    movieRating: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    ratingStars: {
      color: "#ffd700",
      fontSize: "16px",
    },
    ratingText: {
      fontSize: "14px",
      color: "#666",
      marginLeft: "5px",
    },
    hotBadge: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
      color: "white",
      padding: "5px 10px",
      borderRadius: "15px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    awardBadge: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "linear-gradient(135deg, #ffd700 0%, #ffb347 100%)",
      color: "white",
      padding: "5px 10px",
      borderRadius: "15px",
      fontSize: "12px",
      fontWeight: "bold",
    },
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // Giả sử mỗi movie có thuộc tính vote_average (thang 10)
  const getRate5 = (vote_average) => Math.round((vote_average / 2) * 10) / 10; // chuyển sang thang 5, làm tròn 1 số thập phân

  return (
    <div style={sectionStyles.container}>
      <div style={sectionStyles.title}>
        {title}
        <div style={sectionStyles.titleUnderline}></div>
      </div>

      <div style={sectionStyles.moviesGrid}>
        {movies.map((movie, index) => (
          <div
            key={index}
            style={{
              ...sectionStyles.movieCard,
              ...(movies.length === 1 && {
                maxWidth: 600,
                width: "100%",
                margin: "0 auto",
                borderRadius: 24,
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }),
            }}
            onClick={() => handleMovieClick(movie)}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-10px)";
              e.target.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div
              style={{
                ...sectionStyles.movieImage,
                ...(movies.length === 1 && {
                  height: "600px",
                  borderRadius: 24,
                  background: "#fff",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }),
              }}
            >
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path, "w780")}
                  alt={movie.title}
                  style={{
                    width: movies.length === 1 ? "auto" : "100%",
                    height: movies.length === 1 ? "100%" : "100%",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: movies.length === 1 ? "contain" : "cover",
                    borderRadius: movies.length === 1 ? 24 : "inherit",
                    background: "#fff",
                    boxShadow:
                      movies.length === 1
                        ? "0 4px 32px rgba(0,0,0,0.10)"
                        : undefined,
                    position: "relative",
                  }}
                />
              ) : (
                <div>Không có ảnh</div>
              )}
            </div>
            <div style={sectionStyles.movieInfo}>
              <h3 style={sectionStyles.movieTitle}>{movie.title}</h3>
              <p style={sectionStyles.movieYear}>{movie.year}</p>
              <div style={sectionStyles.movieRating}>
                <span>
                  Đánh giá:&nbsp;
                  <span style={{ color: "#FFD700", fontSize: 18 }}>
                    {"★".repeat(Math.round(getRate5(movie.vote_average)))}
                    {"☆".repeat(5 - Math.round(getRate5(movie.vote_average)))}
                  </span>
                  &nbsp;({getRate5(movie.vote_average)}/5)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSection;
