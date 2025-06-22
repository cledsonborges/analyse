// src/components/dashboard/ChartCard.jsx
import React from 'react';

const ChartCard = ({ title, children }) => {
  // This component will wrap chart implementations
  // Children could be a Recharts component, or custom CSS chart like in App.jsx
  return (
    <div className="chart-card">
      <h3 className="chart-card-title">{title}</h3>
      <div className="chart-card-content">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
