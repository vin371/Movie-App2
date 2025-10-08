import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
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

  const headerStyles = {
    background: "#667eea",
    color: "#fff",
    padding: isMobile ? "10px 4px" : "18px 32px 10px 32px",
    borderRadius: "12px 12px 16px 16px",
    boxShadow: "0 2px 16px rgba(102,126,234,0.10)",
    position: "relative",
    zIndex: 100,
    width: "100%",
    minHeight: isMobile ? "54px" : "64px",
    display: "block",
  };
  const containerStyles = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    justifyContent: "flex-start",
    position: "relative",
    width: "100%",
    padding: isMobile ? "0" : "0 8px",
  };
  const logoStyles = {
    fontWeight: 700,
    fontSize: isMobile ? "1.2rem" : "1.5rem",
    letterSpacing: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    marginBottom: isMobile ? "8px" : 0,
    marginLeft: isMobile ? "2px" : "0",
    userSelect: "none",
  };
  const logoIconStyles = {
    fontSize: isMobile ? "1.3rem" : "1.7rem",
    marginRight: "8px",
  };
  const navListStyles = {
    listStyle: "none",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    margin: 0,
    padding: 0,
    width: isMobile ? "100%" : "auto",
    gap: isMobile ? "2px" : "0",
  };
  const navLinkStyles = {
    color: "#fff",
    textDecoration: "none",
    fontSize: isMobile ? "0.95rem" : "1.08rem",
    fontWeight: 500,
    padding: isMobile ? "8px 0" : "10px 18px",
    borderRadius: isMobile ? 0 : "8px",
    transition: "background 0.2s, color 0.2s, transform 0.2s",
    position: "relative",
    display: "block",
    letterSpacing: "0.5px",
    width: isMobile ? "100%" : undefined,
    textAlign: isMobile ? "left" : undefined,
  };
  const searchContainerStyles = {
    display: "flex",
    alignItems: "center",
    marginLeft: isMobile ? 0 : "16px",
    width: isMobile ? "100%" : undefined,
    marginTop: isMobile ? 2 : undefined,
  };
  const searchFormStyles = {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.13)",
    borderRadius: "30px",
    padding: isMobile ? "2px 6px" : "4px 10px 4px 18px",
    boxShadow: searchFocus
      ? "0 4px 16px rgba(118,75,162,0.15)"
      : "0 2px 8px rgba(102,126,234,0.10)",
    transition: "box-shadow 0.2s, border 0.2s",
    border: searchFocus
      ? "2px solid #fff"
      : "1.5px solid rgba(255,255,255,0.18)",
  };
  const searchInputStyles = {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    padding: isMobile ? "6px 0" : "10px 0",
    fontSize: isMobile ? "0.95rem" : "1rem",
    width: isMobile ? "90px" : "170px",
    borderRadius: "20px",
    transition: "width 0.3s",
  };
  const searchButtonStyles = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: isMobile ? "6px 8px" : "8px 12px",
    borderRadius: "50%",
    marginLeft: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s, transform 0.2s",
    boxShadow: "0 2px 8px rgba(118,75,162,0.10)",
    fontSize: isMobile ? "1rem" : undefined,
  };

  const handleLogoClick = () => {
    navigate("/home");
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={headerStyles}>
      <div style={containerStyles}>
        <div style={logoStyles} onClick={handleLogoClick}>
          <span style={logoIconStyles}>🎬</span>
          CPMV
        </div>
        {/* Toggle button for mobile - đẹp, nổi bật, không đè lên search */}
        {isMobile && (
          <button
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              fontSize: "2.1rem",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(102,126,234,0.18)",
              padding: "8px 12px",
              borderRadius: "50%",
              position: "fixed",
              top: 18,
              right: 18,
              zIndex: 2002,
              transition: "background 0.2s, box-shadow 0.2s",
              outline: menuOpen ? "2px solid #fff" : "none",
            }}
            aria-label="Mở menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span style={{ display: "inline-block", lineHeight: 1 }}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="7" y1="10" x2="25" y2="10" />
                <line x1="7" y1="16" x2="25" y2="16" />
                <line x1="7" y1="22" x2="25" y2="22" />
              </svg>
            </span>
          </button>
        )}
        {/* Menu navigation - đẹp, nổi bật, không đè lên search */}
        {(!isMobile || menuOpen) && (
          <nav
            style={{
              position: isMobile ? "fixed" : "static",
              top: isMobile ? 60 : undefined,
              left: isMobile ? 0 : undefined,
              right: isMobile ? 0 : undefined,
              background: isMobile ? "rgba(102,126,234,0.98)" : undefined,
              zIndex: 2001,
              width: isMobile ? "100vw" : undefined,
              padding: isMobile ? "18px 0 12px 0" : undefined,
              borderRadius: isMobile ? "0 0 18px 18px" : undefined,
              boxShadow: isMobile
                ? "0 8px 32px rgba(102,126,234,0.18)"
                : undefined,
              marginTop: isMobile ? 0 : undefined,
            }}
          >
            <ul
              style={{
                ...navListStyles,
                flexDirection: isMobile ? "column" : "row",
                textAlign: isMobile ? "left" : undefined,
              }}
            >
              <li>
                <Link
                  style={navLinkStyles}
                  to="/home"
                  onClick={() => setMenuOpen(false)}
                >
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  style={navLinkStyles}
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link
                  style={navLinkStyles}
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                >
                  Về Chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  style={{
                    ...navLinkStyles,
                    color: "#1976d2",
                    fontWeight: "bold",
                  }}
                  to="/upload"
                  onClick={() => setMenuOpen(false)}
                >
                  Upload Video
                </Link>
              </li>
            </ul>
          </nav>
        )}
        {/* Search bar */}
        <div style={searchContainerStyles}>
          <form style={searchFormStyles} onSubmit={handleSearch}>
            <input
              style={searchInputStyles}
              type="text"
              placeholder="Tìm phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            <button style={searchButtonStyles} type="submit" title="Tìm kiếm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
