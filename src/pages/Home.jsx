import React, { useState, useEffect } from "react";
import MovieSection from "../components/MovieSection";
import PeopleSection from "../components/PeopleSection";
import {  fetchNominatedMovies } from "../data/movieData";
import {
  getPopularPeople,
  transformPeopleData,
} from "../services/movieService";

const Home = ({ hotMovies: appHotMovies }) => {
  const [nominatedMovies, setNominatedMovies] = useState([]);
  const [ setPopularPeople] = useState([]);
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
  }, []);

  const homeStyles = {
    container: {
      padding: "40px 20px",
      textAlign: "center",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    welcomeSection: {
      marginBottom: "60px",
    },
    welcomeTitle: {
      color: "#333",
      fontSize: "2.5rem",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    welcomeText: {
      color: "#666",
      fontSize: "1.2rem",
      lineHeight: "1.6",
      maxWidth: "600px",
      margin: "0 auto",
    },
    sectionsContainer: {
      textAlign: "left",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      fontSize: "18px",
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
      <video controls width="800" style={{ marginBottom: "2rem" }}>
        <source
          src="https://myvideocpm.b-cdn.net/conan_halloween_fixed.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {/* Welcome Section */}
      <div style={homeStyles.welcomeSection}>
        <h1 style={homeStyles.welcomeTitle}>Welcome to CPMV</h1>
        <p style={homeStyles.welcomeText}>
          Your ultimate destination for movies and entertainment. Discover the
          latest films, explore different genres, and find your next favorite
          movie.
        </p>
      </div>

      {/* Movie Sections */}
      <div style={homeStyles.sectionsContainer}>
        <MovieSection title="🔥 Phim Hot" movies={appHotMovies || []} />

        <MovieSection title="🏆 Phim Đề Cử" movies={nominatedMovies} />
      </div>
    </div>
  );
};

export default Home;
