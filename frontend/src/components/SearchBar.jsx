import React, { useEffect, useId, useState } from "react";

function SearchBar({
  onSearch,
  disabled,
  placeholder,
  defaultKeyword = "",
  compact = false
}) {
  const inputId = useId();
  const [value, setValue] = useState(defaultKeyword);

  useEffect(() => {
    setValue(defaultKeyword);
  }, [defaultKeyword]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form
      className={`search-bar${compact ? " search-bar--compact" : ""}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <label htmlFor={inputId} className="visually-hidden">
        Search products
      </label>
      <input
        id={inputId}
        type="search"
        className="search-bar__input"
        placeholder={placeholder || "Search products…"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoComplete="off"
      />
      <button
        type="submit"
        className="btn btn-primary search-bar__btn"
        disabled={disabled}
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
