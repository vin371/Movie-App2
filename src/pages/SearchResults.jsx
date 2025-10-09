import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MovieSection from "../components/MovieSection";
import { searchMovies } from "../services/movieService";
// import { fallbackHotMovies } from "../data/movieData"; // Không dùng

const SearchResults = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  useEffect(() => {
    // Lấy query từ URL params
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get("q");

    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [location.search]);
  // Hàm loại bỏ dấu tiếng Việt
  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setError(null);

      // Lấy nhiều trang kết quả (ưu tiên phim Việt Nam)
      let allResults = [];
      for (let page = 1; page <= 3; page++) {
        const response = await searchMovies(searchQuery, page);
        if (response.results) {
          allResults = allResults.concat(response.results);
        }
      }

      // Loại trùng lặp theo id
      const uniqueResults = Object.values(
        allResults.reduce((acc, movie) => {
          acc[movie.id] = movie;
          return acc;
        }, {})
      );

      // Chuẩn hóa chuỗi tìm kiếm và tên phim về không dấu, không phân biệt hoa/thường
      const normalizedQuery = removeVietnameseTones(searchQuery).toLowerCase();

      // Ưu tiên phim Việt Nam
      const vietnamMovies = uniqueResults.filter(
        (movie) =>
          movie.original_language === "vi" ||
          removeVietnameseTones(movie.title || "")
            .toLowerCase()
            .includes("viet") ||
          removeVietnameseTones(movie.title || "")
            .toLowerCase()
            .includes(normalizedQuery)
      );

      // Nếu có phim Việt Nam, trả về trước, nếu không thì trả về tất cả kết quả khớp query
      const filtered =
        vietnamMovies.length > 0
          ? vietnamMovies
          : uniqueResults.filter((movie) =>
              removeVietnameseTones(movie.title || "")
                .toLowerCase()
                .includes(normalizedQuery)
            );

      setSearchResults(filtered);
    } catch {
      setError("Không thể tìm kiếm phim. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const searchStyles = {
    container: {
      padding: isMobile ? "16px 4px" : "40px 20px",
      maxWidth: isMobile ? "100vw" : "1400px",
      margin: "0 auto",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: isMobile ? "120px" : "200px",
      fontSize: isMobile ? "1rem" : "18px",
      color: "#666",
    },
    errorContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: isMobile ? "120px" : "200px",
      fontSize: isMobile ? "1rem" : "18px",
      color: "#e74c3c",
      background: "#fdf2f2",
      borderRadius: "10px",
      margin: "20px 0",
    },
    noResults: {
      textAlign: "center",
      padding: isMobile ? "24px 4px" : "60px 20px",
      color: "#666",
    },
    noResultsTitle: {
      fontSize: isMobile ? "1.2rem" : "24px",
      marginBottom: "15px",
      color: "#333",
    },
    noResultsText: {
      fontSize: isMobile ? "0.95rem" : "16px",
      lineHeight: "1.6",
    },
  };

  return (
    <div style={searchStyles.container}>
      {/* Loading State */}
      {loading && (
        <div style={searchStyles.loadingContainer}>
          🎬 Đang tìm kiếm phim...
        </div>
      )}

      {/* Error State */}
      {error && <div style={searchStyles.errorContainer}>❌ {error}</div>}

      {/* No Results */}
      {!loading && !error && query && searchResults.length === 0 && (
        <div style={searchStyles.noResults}>
          <h3 style={searchStyles.noResultsTitle}>Không tìm thấy phim nào</h3>
          <p style={searchStyles.noResultsText}>
            Không có kết quả nào cho từ khóa "{query}".
            <br />
            Hãy thử tìm kiếm với từ khóa khác.
          </p>
        </div>
      )}

      {/* Search Results */}
      {!loading && !error && searchResults.length > 0 && (
        <MovieSection
          title={`🎬 Phim Tìm Được: "${query}"`}
          movies={searchResults}
        />
      )}
    </div>
  );
};

export default SearchResults;
