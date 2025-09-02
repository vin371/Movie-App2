import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import './App.css'
import About from './pages/About'
import Contact from './pages/Contact'
import SearchResults from './pages/SearchResults'
import MovieDetail from './pages/MovieDetail';
import Watch from './pages/Watch'; // Nếu chưa có, bạn cần tạo file này

function App() {
  const [hotMovies, setHotMovies] = useState([]);

  useEffect(() => {
    const fetchHotMovies = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
          }
        };
        
        // Gọi API phim hot thay vì people
        const url = 'https://api.themoviedb.org/3/movie/popular?language=vi&page=1';
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log('🔥 PHIM HOT API Response:', data);
        
        // Chuyển đổi dữ liệu để phù hợp với MovieSection
        const transformedMovies = data.results?.slice(0, 6).map(movie => ({
          id: movie.id,
          title: movie.title,
          year: new Date(movie.release_date).getFullYear(),
          rating: Math.round((movie.vote_average / 2) * 10) / 10, // Chuyển từ 10 điểm sang 5 điểm
          badge: movie.vote_average > 7.5 ? 'HOT' : 'AWARD',
          genre: movie.genre_ids ? movie.genre_ids.join(', ') : 'Unknown',
          description: movie.overview,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          release_date: movie.release_date,
          original_language: movie.original_language
        })) || [];
        
        setHotMovies(transformedMovies);
        console.log('🎬 Danh sách phim hot đã được xử lý:', transformedMovies);
        
      } catch (error) {
        console.error('❌ Error fetching hot movies:', error);
      }
    }
    
    fetchHotMovies();
  }, []);


  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home hotMovies={hotMovies} />} />
            <Route path="/home" element={<Home hotMovies={hotMovies} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/watch/:id" element={<Watch />} /> {/* Thêm dòng này */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
