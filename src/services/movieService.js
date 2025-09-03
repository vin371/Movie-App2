// Movie Service để gọi API TMDB
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-vercel-server.vercel.app';

// Hàm gọi API chung
const fetchFromTMDB = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
};

// Lấy danh sách phim phổ biến (Popular Movies)
export const getPopularMovies = async (page = 1) => {
  return await fetchFromTMDB(`/movie/popular?language=vi&page=${page}`);
};

// Lấy danh sách phim đang chiếu (Now Playing)
export const getNowPlayingMovies = async (page = 1) => {
  return await fetchFromTMDB(`/movie/now_playing?language=vi&page=${page}`);
};

// Lấy danh sách phim sắp chiếu (Upcoming)
export const getUpcomingMovies = async (page = 1) => {
  return await fetchFromTMDB(`/movie/upcoming?language=vi&page=${page}`);
};

// Lấy danh sách phim được đánh giá cao (Top Rated)
export const getTopRatedMovies = async (page = 1) => {
  return await fetchFromTMDB(`/movie/top_rated?language=vi&page=${page}`);
};

// Lấy chi tiết phim
export const getMovieDetails = async (movieId) => {
  return await fetchFromTMDB(`/movie/${movieId}?language=vi`);
};

// Tìm kiếm phim
export const searchMovies = async (query, page = 1) => {
  return await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&language=vi&page=${page}`);
};

// Lấy danh sách người nổi tiếng (Popular People)
export const getPopularPeople = async (page = 1) => {
  return await fetchFromTMDB(`/person/popular?language=vi&page=${page}`);
};

// Lấy hình ảnh poster
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  const baseUrl = import.meta.env.VITE_IMAGE_URL || 'https://image.tmdb.org/t/p/w500';
  // Nếu VITE_IMAGE_URL đã có size, chỉ cần thêm path
  if (baseUrl.includes('/w500')) {
    return `${baseUrl.replace('/w500', '')}/${size}${path}`;
  }
  return `${baseUrl}/${size}${path}`;
};

// Chuyển đổi dữ liệu từ TMDB API thành format của chúng ta
export const transformMovieData = (tmdbMovie) => {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    year: new Date(tmdbMovie.release_date).getFullYear(),
    rating: Math.round((tmdbMovie.vote_average / 2) * 10) / 10, // Chuyển từ 10 điểm sang 5 điểm
    badge: tmdbMovie.vote_average > 7.5 ? 'HOT' : 'AWARD',
    genre: tmdbMovie.genre_ids ? tmdbMovie.genre_ids.join(', ') : 'Unknown',
    description: tmdbMovie.overview,
    poster_path: tmdbMovie.poster_path,
    backdrop_path: tmdbMovie.backdrop_path,
    vote_average: tmdbMovie.vote_average,
    vote_count: tmdbMovie.vote_count,
    release_date: tmdbMovie.release_date,
    original_language: tmdbMovie.original_language
  };
};

// Chuyển đổi dữ liệu người nổi tiếng từ TMDB API
export const transformPeopleData = (tmdbPerson) => {
  return {
    id: tmdbPerson.id,
    name: tmdbPerson.name,
    known_for_department: tmdbPerson.known_for_department,
    popularity: tmdbPerson.popularity,
    profile_path: tmdbPerson.profile_path,
    known_for: tmdbPerson.known_for || [],
    adult: tmdbPerson.adult,
    gender: tmdbPerson.gender
  };
};

export const getMovieVideos = async (movieId) => {
  // Lấy video với ngôn ngữ tiếng Việt, fallback tiếng Anh nếu không có
  let data = await fetchFromTMDB(`/movie/${movieId}/videos?language=vi`);
  if (!data.results || data.results.length === 0) {
    data = await fetchFromTMDB(`/movie/${movieId}/videos?language=en-US`);
  }
  return data.results || [];
};
