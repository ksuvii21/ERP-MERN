import React from 'react';

const ChartCard = ({ title }) => {
  return (
    <div style={{ border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', margin: '10px', flex: 1, backgroundColor: 'white' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>{title}</h3>
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        [Chart Placeholder]
        <br />
        <small style={{ textAlign: 'center', display: 'block' }}>Integrate a library like Recharts or Chart.js here</small>
      </div>
    </div>
  );
};

export default ChartCard;