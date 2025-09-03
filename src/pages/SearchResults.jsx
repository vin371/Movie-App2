import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MovieSection from '../components/MovieSection';
import { searchMovies, transformMovieData } from '../services/movieService';
import { fallbackHotMovies } from '../data/movieData';

const SearchResults = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Lấy query từ URL params
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('q');
    
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [location.search]);

  // Hàm loại bỏ dấu tiếng Việt
  function removeVietnameseTones(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setError(null);

      // Gọi API TMDB
      const response = await searchMovies(searchQuery, 1);

      // Chuẩn hóa chuỗi tìm kiếm và tên phim về không dấu, không phân biệt hoa/thường
      const normalizedQuery = removeVietnameseTones(searchQuery).toLowerCase();
      const filtered = (response.results || []).filter(movie =>
        removeVietnameseTones(movie.title || '').toLowerCase().includes(normalizedQuery)
      );
      console.log('Kết quả tìm kiếm từ API:', filtered);
      setSearchResults(filtered);
    } catch (err) {
      setError('Không thể tìm kiếm phim. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const searchStyles = {
    container: {
      padding: '40px 20px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '18px',
      color: '#666',
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '18px',
      color: '#e74c3c',
      background: '#fdf2f2',
      borderRadius: '10px',
      margin: '20px 0',
    },
    noResults: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#666',
    },
    noResultsTitle: {
      fontSize: '24px',
      marginBottom: '15px',
      color: '#333',
    },
    noResultsText: {
      fontSize: '16px',
      lineHeight: '1.6',
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
      {error && (
        <div style={searchStyles.errorContainer}>
          ❌ {error}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && query && searchResults.length === 0 && (
        <div style={searchStyles.noResults}>
          <h3 style={searchStyles.noResultsTitle}>Không tìm thấy phim nào</h3>
          <p style={searchStyles.noResultsText}>
            Không có kết quả nào cho từ khóa "{query}".<br />
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
