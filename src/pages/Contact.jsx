import React from 'react';

const Contact = () => {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '20px' }}>
        Contact Us
      </h1>
      <p style={{ color: '#666', fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
        Get in touch with us for any questions, suggestions, or feedback about CPMV. 
        We'd love to hear from you!
      </p>
      <div style={{ marginTop: '40px', maxWidth: '500px', margin: '40px auto 0' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Email</h3>
          <p style={{ color: '#666' }}>contact@cpmv.com</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Phone</h3>
          <p style={{ color: '#666' }}>+1 (555) 123-4567</p>
        </div>
        <div>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Address</h3>
          <p style={{ color: '#666' }}>123 Movie Street, Cinema City, CC 12345</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;