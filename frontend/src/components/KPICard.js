import React from 'react';

const KPICard = ({ title, value, icon }) => {
  return (
    <div style={{ border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', margin: '10px', minWidth: '200px', textAlign: 'center', backgroundColor: 'white' }}>
      <h3 style={{ margin: 0, color: '#555' }}>{title}</h3>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: '#333' }}>{value}</div>
      {icon && <div style={{ fontSize: '2rem' }}>{icon}</div>}
    </div>
  );
};

export default KPICard;