import React from "react";
import StarRating from "./StarRating";

function ReviewList({ reviews, loading, emptyText }) {
  if (loading) {
    return <p className="muted review-list__status">Loading reviews…</p>;
  }

  if (!reviews?.length) {
    return (
      <p className="muted review-list__empty">{emptyText || "No reviews yet."}</p>
    );
  }

  return (
    <ul className="review-list">
      {reviews.map((r) => (
        <li key={r.id} className="review-list__item card card--soft">
          <div className="review-list__head">
            <StarRating value={r.rating} readOnly size="sm" />
            <span className="review-list__author">{r.user?.name || "Customer"}</span>
            <time
              className="review-list__date"
              dateTime={r.createdAt}
            >
              {new Date(r.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </time>
          </div>
          {r.comment ? (
            <p className="review-list__comment">{r.comment}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
