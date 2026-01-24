import React from 'react';

const ChartCard = ({ title, children }) => {
  return (
    <div style={{ border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', margin: '10px', flex: 1, backgroundColor: 'white', minWidth: '300px' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>{title}</h3>
      <div style={{ height: '300px', position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children ? (
          children
        ) : (
          <div style={{ backgroundColor: '#f9f9f9', borderRadius: '4px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            [Chart Placeholder]
            <br />
            <small style={{ textAlign: 'center', display: 'block' }}>Integrate a library like Recharts or Chart.js here</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;