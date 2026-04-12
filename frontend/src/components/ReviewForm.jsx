import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createReview } from "../services/api";
import StarRating from "./StarRating";

function ReviewForm({ productId, onSubmitted }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage("Sign in to leave a review.");
      return;
    }
    setMessage("");
    setSubmitting(true);
    try {
      await createReview({
        productId,
        rating,
        comment: comment.trim() || undefined
      });
      setComment("");
      setRating(5);
      onSubmitted?.();
      setMessage("Thanks — your review was posted.");
    } catch (err) {
      setMessage(err.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <p className="review-form__hint muted">
        <Link to="/login">Sign in</Link> to write a review.
      </p>
    );
  }

  return (
    <form className="review-form card card--soft" onSubmit={handleSubmit}>
      <h3 className="review-form__title">Write a review</h3>
      <div className="review-form__field">
        <span className="review-form__label">Your rating</span>
        <StarRating value={rating} readOnly={false} onChange={setRating} />
      </div>
      <div className="form-group review-form__field">
        <label htmlFor={`review-comment-${productId}`}>Comment (optional)</label>
        <textarea
          id={`review-comment-${productId}`}
          className="review-form__textarea"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product…"
          disabled={submitting}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-inline"
        disabled={submitting}
      >
        {submitting ? "Submitting…" : "Submit review"}
      </button>
      {message ? (
        <p className="review-form__message" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}

export default ReviewForm;
