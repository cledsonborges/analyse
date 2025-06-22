// src/components/dashboard/MetricsCard.jsx
import React from 'react';

// const getIcon = (iconName) => {
//   // In a real app, you might use a library like lucide-react here
//   // For now, just a placeholder
//   switch(iconName) {
//     case 'total_reviews': return '📊';
//     case 'average_rating': return '⭐';
//     case 'current_version': return '📦';
//     case 'last_updated': return '📅';
//     default: return '❔';
//   }
// }

const MetricsCard = ({ title, value, icon, trend }) => {
  return (
    <div className="metrics-card">
      <div className="metrics-card-icon">{icon /*getIcon(icon)*/}</div>
      <div className="metrics-card-content">
        <h3 className="metrics-card-title">{title}</h3>
        <p className="metrics-card-value">{value}</p>
        {trend && <p className={`metrics-card-trend ${trend.direction}`}>{trend.value}</p>}
      </div>
    </div>
  );
};

export default MetricsCard;
