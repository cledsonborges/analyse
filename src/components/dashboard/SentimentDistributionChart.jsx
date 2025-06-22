// src/components/dashboard/SentimentDistributionChart.jsx
import React from 'react';

const SentimentDistributionChart = ({ analysis }) => {
  if (!analysis) {
    return <p>No analysis data available.</p>;
  }

  const { positive_percentage, negative_percentage, neutral_percentage } = analysis;

  const sentimentData = [
    { label: 'Positive', value: positive_percentage, className: 'positive' },
    { label: 'Negative', value: negative_percentage, className: 'negative' },
    { label: 'Neutral', value: neutral_percentage, className: 'neutral' },
  ];

  return (
    <div className="sentiment-chart-container">
      {sentimentData.map(item => (
        <div key={item.label} className="sentiment-bar-item">
          <span className="sentiment-bar-label">{item.label}</span>
          <div className="sentiment-bar-track">
            <div
              className={`sentiment-bar-fill ${item.className}`}
              style={{ width: `${item.value || 0}%` }}
              title={`${item.value || 0}%`}
            >
            </div>
          </div>
          <span className="sentiment-bar-value">{item.value || 0}%</span>
        </div>
      ))}
    </div>
  );
};

export default SentimentDistributionChart;
