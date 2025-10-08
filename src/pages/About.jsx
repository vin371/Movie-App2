import React from "react";

const About = () => {
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
  return (
    <div
      style={{
        padding: isMobile ? "16px 4px" : "40px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          color: "#333",
          fontSize: isMobile ? "1.5rem" : "2.5rem",
          marginBottom: "20px",
        }}
      >
        About CPMV
      </h1>
      <p
        style={{
          color: "#666",
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          maxWidth: isMobile ? "100vw" : "600px",
          margin: isMobile ? "0" : "0 auto",
        }}
      >
        CPMV is your ultimate destination for discovering and exploring movies.
        We provide comprehensive information about films, reviews, and
        recommendations to help you find your next favorite movie.
      </p>
      <div
        style={{
          marginTop: isMobile ? "24px" : "40px",
          maxWidth: isMobile ? "100vw" : "500px",
          margin: isMobile ? "24px 0 0 0" : "40px auto 0",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", marginBottom: "10px" }}>Our Mission</h3>
          <p
            style={{
              color: "#666",
              fontSize: isMobile ? "0.95rem" : undefined,
            }}
          >
            To make movie discovery easy and enjoyable for everyone, providing
            accurate information and personalized recommendations.
          </p>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", marginBottom: "10px" }}>What We Offer</h3>
          <p
            style={{
              color: "#666",
              fontSize: isMobile ? "0.95rem" : undefined,
            }}
          >
            Movie reviews, ratings, trailers, cast information, and personalized
            recommendations based on your preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
