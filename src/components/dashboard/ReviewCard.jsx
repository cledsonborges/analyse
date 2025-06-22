// src/components/dashboard/ReviewCard.jsx
import React from 'react';

// Helper to get sentiment styling (can be moved to utils)
const getSentimentClass = (sentiment) => {
  if (!sentiment) return 'neutral';
  return sentiment.toLowerCase();
};

const ReviewCard = ({ review }) => {
  const { user_name, rating, sentiment, content, date, sentiment_score } = review;

  return (
    <div className={`review-card-new ${getSentimentClass(sentiment)}`}>
      <div className="review-card-new-header">
        <span className="review-user">{user_name || 'Anonymous User'}</span>
        <span className="review-rating">{'⭐'.repeat(rating || 0)}</span>
      </div>
      <p className="review-content-new">{content}</p>
      <div className="review-card-new-footer">
        <span className="review-date-new">
          {date ? new Date(date).toLocaleDateString('pt-BR') : 'N/A'}
        </span>
        {sentiment && (
          <span className={`review-sentiment-badge ${getSentimentClass(sentiment)}`}>
            {sentiment}
            {sentiment_score && ` (${(sentiment_score * 100).toFixed(0)}%)`}
          </span>
        )}
      </div>
    </div>
  );
};

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="no-reviews-text">No reviews available for this app yet.</p>;
  }

  return (
    <div className="review-list-container">
      <h3 className="review-list-title">Recent Reviews</h3>
      <div className="review-list-items">
        {reviews.map(review => (
          <ReviewCard key={review.id || Math.random()} review={review} />
        ))}
      </div>
    </div>
  );
};

export { ReviewCard, ReviewList };
