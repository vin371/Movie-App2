import React from 'react';

const About = () => {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '20px' }}>
        About CPMV
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
        CPMV is your ultimate destination for discovering and exploring movies. 
        We provide comprehensive information about films, reviews, and recommendations 
        to help you find your next favorite movie.
      </p>
      <div style={{ marginTop: '40px', maxWidth: '500px', margin: '40px auto 0' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Our Mission</h3>
          <p style={{ color: '#666' }}>
            To make movie discovery easy and enjoyable for everyone, 
            providing accurate information and personalized recommendations.
          </p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>What We Offer</h3>
          <p style={{ color: '#666' }}>
            Movie reviews, ratings, trailers, cast information, 
            and personalized recommendations based on your preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;