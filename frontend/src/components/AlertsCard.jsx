import React from 'react';

const AlertsCard = ({ title, alerts }) => {
  return (
    <div style={{ border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', margin: '10px', flex: 1, backgroundColor: 'white' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {alerts.map((alert, index) => (
          <li key={index} style={{ color: alert.type === 'error' ? '#D32F2F' : '#F57C00', borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <strong>{alert.type === 'error' ? '❗' : '⚠️'}</strong> {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsCard;