import React from "react";

const Contact = () => {
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
        Contact Us
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
        Get in touch with us for any questions, suggestions, or feedback about
        CPMV. We'd love to hear from you!
      </p>
      <div
        style={{
          marginTop: isMobile ? "24px" : "40px",
          maxWidth: isMobile ? "100vw" : "500px",
          margin: isMobile ? "24px 0 0 0" : "40px auto 0",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", marginBottom: "10px" }}>Email</h3>
          <p
            style={{
              color: "#666",
              fontSize: isMobile ? "0.95rem" : undefined,
            }}
          >
            contact@cpmv.com
          </p>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#333", marginBottom: "10px" }}>Phone</h3>
          <p
            style={{
              color: "#666",
              fontSize: isMobile ? "0.95rem" : undefined,
            }}
          >
            +1 (555) 123-4567
          </p>
        </div>
        <div>
          <h3 style={{ color: "#333", marginBottom: "10px" }}>Address</h3>
          <p
            style={{
              color: "#666",
              fontSize: isMobile ? "0.95rem" : undefined,
            }}
          >
            123 Movie Street, Cinema City, CC 12345
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
