import React from "react";

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** Display or edit a 1–5 star rating. */
function StarRating({
  value,
  max = 5,
  readOnly = true,
  onChange,
  size = "md",
  className = ""
}) {
  const numeric =
    value == null || Number.isNaN(Number(value)) ? 0 : Number(value);
  const display = clamp(numeric, 0, max);

  const sizeClass =
    size === "sm" ? "star-rating--sm" : size === "lg" ? "star-rating--lg" : "";

  return (
    <div
      className={`star-rating ${sizeClass} ${className}`.trim()}
      role={readOnly ? "img" : "group"}
      aria-label={
        readOnly
          ? `Rating ${display} out of ${max}`
          : "Select a rating from 1 to 5 stars"
      }
    >
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const filled = display >= starIndex - 0.001;
        if (readOnly) {
          return (
            <span
              key={starIndex}
              className={`star-rating__star star-rating__star--static${filled ? " star-rating__star--on" : ""}`}
              aria-hidden
            >
              ★
            </span>
          );
        }
        return (
          <button
            key={starIndex}
            type="button"
            className={`star-rating__star${filled ? " star-rating__star--on" : ""}`}
            aria-pressed={display >= starIndex}
            aria-label={`${starIndex} star${starIndex > 1 ? "s" : ""}`}
            onClick={() => onChange?.(starIndex)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
