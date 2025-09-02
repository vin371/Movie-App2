import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate đến trang search results
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  // Modern styles
  const styles = {
    header: {
      background: 'rgba(102,126,234,0.95)',
      boxShadow: '0 4px 24px 0 rgba(80,80,120,0.10)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderRadius: '0 0 24px 24px',
      backdropFilter: 'blur(8px)',
      transition: 'box-shadow 0.3s',
    },
    headerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '80px',
    },
    logo: {
      color: '#fff',
      margin: 0,
      fontSize: '2rem',
      fontWeight: 'bold',
      letterSpacing: '2px',
      textShadow: '0 2px 8px rgba(118,75,162,0.25)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      userSelect: 'none',
    },
    logoIcon: {
      fontSize: '2.2rem',
      filter: 'drop-shadow(0 2px 8px #fff8)',
    },
    navMenu: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
    },
    navList: {
      display: 'flex',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      gap: '36px',
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
      fontSize: '1.08rem',
      fontWeight: 500,
      padding: '10px 18px',
      borderRadius: '8px',
      transition: 'background 0.2s, color 0.2s, transform 0.2s',
      position: 'relative',
      display: 'block',
      letterSpacing: '0.5px',
    },
    navLinkActive: {
      background: 'rgba(255,255,255,0.18)',
      color: '#ffd700',
      fontWeight: 700,
      transform: 'scale(1.07)',
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: '16px',
    },
    searchForm: {
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.13)',
      borderRadius: '30px',
      padding: '4px 10px 4px 18px',
      border: '1.5px solid rgba(255,255,255,0.18)',
      boxShadow: '0 2px 8px rgba(102,126,234,0.10)',
      transition: 'box-shadow 0.2s, border 0.2s',
    },
    searchInput: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#fff',
      padding: '10px 0',
      fontSize: '1rem',
      width: '170px',
      borderRadius: '20px',
      transition: 'width 0.3s',
    },
    searchInputFocus: {
      width: '220px',
      background: 'rgba(255,255,255,0.18)',
    },
    searchButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '50%',
      marginLeft: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s, transform 0.2s',
      boxShadow: '0 2px 8px rgba(118,75,162,0.10)',
    },
  };

  // State for search input focus effect
  const [searchFocus, setSearchFocus] = useState(false);

  // Responsive: hide nav on small screens (optional, for demo)
  // You can add a hamburger menu for mobile if needed

  return (
    <header style={styles.header}>
      <div style={styles.headerContainer}>
        {/* Logo */}
        <div style={styles.logo} onClick={handleLogoClick}>
          <span style={styles.logoIcon}>🎬</span>
          CPMV
        </div>

        {/* Navigation Menu */}
        <nav style={styles.navMenu}>
          <ul style={styles.navList}>
            <li>
              <Link
                to="/home"
                style={styles.navLink}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.13)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                Trang Chủ
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                style={styles.navLink}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.13)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                Liên Hệ
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                style={styles.navLink}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.13)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                Về Chúng tôi
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search */}
        <div style={styles.searchContainer}>
          <form
            onSubmit={handleSearch}
            style={{
              ...styles.searchForm,
              boxShadow: searchFocus ? '0 4px 16px rgba(118,75,162,0.15)' : styles.searchForm.boxShadow,
              border: searchFocus ? '2px solid #fff' : styles.searchForm.border,
            }}
          >
            <input
              type="text"
              placeholder="Tìm phim..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                ...styles.searchInput,
                ...(searchFocus ? styles.searchInputFocus : {}),
              }}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            <button
              type="submit"
              style={styles.searchButton}
              title="Tìm kiếm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
