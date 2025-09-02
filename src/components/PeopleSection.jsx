import React from 'react';
import { getImageUrl } from '../services/movieService';

const PeopleSection = ({ title, people }) => {
  const sectionStyles = {
    container: {
      marginBottom: '60px',
    },
    title: {
      color: '#333',
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '30px',
      textAlign: 'center',
      position: 'relative',
    },
    titleUnderline: {
      width: '80px',
      height: '4px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      margin: '10px auto 0',
      borderRadius: '2px',
    },
    peopleGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '30px',
      padding: '0 20px',
    },
    personCard: {
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textAlign: 'center',
    },
    personImage: {
      width: '100%',
      height: '250px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      color: '#666',
      position: 'relative',
      overflow: 'hidden',
    },
    personProfileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    personInfo: {
      padding: '20px',
    },
    personName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '8px',
      lineHeight: '1.3',
    },
    personDepartment: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px',
      fontStyle: 'italic',
    },
    personPopularity: {
      fontSize: '12px',
      color: '#888',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
    },
    starIcon: {
      color: '#ffd700',
      fontSize: '14px',
    },
    knownFor: {
      fontSize: '12px',
      color: '#666',
      marginTop: '8px',
      fontStyle: 'italic',
    },
  };

  const handlePersonClick = (person) => {
    console.log('Clicked person:', person.name);
    // Có thể thêm navigation đến trang chi tiết người nổi tiếng
  };

  return (
    <div style={sectionStyles.container}>
      <div style={sectionStyles.title}>
        {title}
        <div style={sectionStyles.titleUnderline}></div>
      </div>
      
      <div style={sectionStyles.peopleGrid}>
        {people.map((person, index) => (
          <div
            key={index}
            style={sectionStyles.personCard}
            onClick={() => handlePersonClick(person)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-10px)';
              e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={sectionStyles.personImage}>
              {person.profile_path ? (
                <img
                  src={getImageUrl(person.profile_path, 'w500')}
                  alt={person.name}
                  style={sectionStyles.personProfileImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{ display: person.profile_path ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                👤 {person.name}
              </div>
            </div>
            
            <div style={sectionStyles.personInfo}>
              <h3 style={sectionStyles.personName}>{person.name}</h3>
              <p style={sectionStyles.personDepartment}>{person.known_for_department}</p>
              <div style={sectionStyles.personPopularity}>
                <span style={sectionStyles.starIcon}>⭐</span>
                <span>Popularity: {Math.round(person.popularity)}</span>
              </div>
              {person.known_for && person.known_for.length > 0 && (
                <div style={sectionStyles.knownFor}>
                  Known for: {person.known_for.map(item => item.title || item.name).slice(0, 2).join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleSection;
