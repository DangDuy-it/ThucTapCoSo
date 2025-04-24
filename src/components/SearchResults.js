import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const keyword = query.get("keyword");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (keyword) {
      axios
        .get(`http://localhost:3001/search?q=${encodeURIComponent(keyword)}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error("Lỗi tìm kiếm:", err));
    }
  }, [keyword]);

  return (
    <div className="search-results">
      <h2>Kết quả tìm kiếm cho: "{keyword}"</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((movie) => (
            <li key={movie.id} className="movie-card">
                <a href={`/movie/${movie.id}`}>
                    <img src={movie.image_url} alt={movie.title} />
                    <div className="movie-title">{movie.title}</div>
                </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không tìm thấy kết quả.</p>
      )}
    </div>
  );
}

export default SearchResults;
