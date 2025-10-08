import React, { useState, useEffect } from "react";
import MovieSection from "../components/MovieSection";
import PeopleSection from "../components/PeopleSection";
import { fetchNominatedMovies } from "../data/movieData";
import {
  getPopularPeople,
  transformPeopleData,
} from "../services/movieService";

const Home = ({ hotMovies: appHotMovies }) => {
  const [nominatedMovies, setNominatedMovies] = useState([]);
  const [setPopularPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [nominatedData, peopleData] = await Promise.all([
          fetchNominatedMovies(),
          getPopularPeople(1),
        ]);

        setNominatedMovies(nominatedData);

        // Transform people data
        const transformedPeople = peopleData.results
          .slice(0, 6)
          .map(transformPeopleData);
        setPopularPeople(transformedPeople);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setPopularPeople]);

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
  const homeStyles = {
    container: {
      padding: isMobile ? "16px 4px" : "40px 20px",
      textAlign: isMobile ? "left" : "center",
      maxWidth: isMobile ? "100vw" : "1400px",
      margin: "0 auto",
    },
    welcomeSection: {
      marginBottom: isMobile ? "24px" : "60px",
    },
    welcomeTitle: {
      color: "#333",
      fontSize: isMobile ? "1.5rem" : "2.5rem",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    welcomeText: {
      color: "#666",
      fontSize: isMobile ? "1rem" : "1.2rem",
      lineHeight: "1.6",
      maxWidth: isMobile ? "100vw" : "600px",
      margin: isMobile ? "0" : "0 auto",
    },
    sectionsContainer: {
      textAlign: isMobile ? "left" : "left",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: isMobile ? "120px" : "200px",
      fontSize: isMobile ? "1rem" : "18px",
      color: "#666",
    },
  };

  if (loading) {
    return (
      <div style={homeStyles.container}>
        <div style={homeStyles.welcomeSection}>
          <h1 style={homeStyles.welcomeTitle}>Welcome to CPMV</h1>
          <p style={homeStyles.welcomeText}>
            Your ultimate destination for movies and entertainment. Discover the
            latest films, explore different genres, and find your next favorite
            movie.
          </p>
        </div>
        <div style={homeStyles.loadingContainer}>
          🎬 Loading movies and people from TMDB...
        </div>
      </div>
    );
  }

  return (
    <div style={homeStyles.container}>
      {/* Movie Sections */}
      <div style={homeStyles.sectionsContainer}>
        <MovieSection title="🔥 Phim Hot" movies={appHotMovies || []} />

        <MovieSection title="🏆 Phim Đề Cử" movies={nominatedMovies} />
      </div>
    </div>
  );
};

export default Home;
