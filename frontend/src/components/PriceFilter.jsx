import React, { useState } from "react";

function PriceFilter({ onApply, disabled }) {
  const [min, setMin] = useState("0");
  const [max, setMax] = useState("150");

  function handleSubmit(e) {
    e.preventDefault();
    const lo = Number(min);
    const hi = Number(max);
    onApply(lo, hi);
  }

  return (
    <form className="price-filter card card--soft" onSubmit={handleSubmit}>
      <h3 className="price-filter__title">Filter by price</h3>
      <div className="price-filter__row">
        <div className="form-group price-filter__group">
          <label htmlFor="price-min">Minimum</label>
          <input
            id="price-min"
            type="number"
            min="0"
            step="0.01"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="form-group price-filter__group">
          <label htmlFor="price-max">Maximum</label>
          <input
            id="price-max"
            type="number"
            min="0"
            step="0.01"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-inline price-filter__btn"
        disabled={disabled}
      >
        Apply filter
      </button>
    </form>
  );
}

export default PriceFilter;
