import React from 'react';

const ProgressBar = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        backgroundColor: '#e0e0de',
        borderRadius: '8px',
        height: '24px',
        width: '100%',
        marginBottom: '5px'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: '#007bff',
          borderRadius: '8px',
          transition: 'width 0.5s ease-in-out'
        }}></div>
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem' }}>
        {completed} of {total} tasks completed ({percentage}%)
      </p>
    </div>
  );
};

export default ProgressBar;
