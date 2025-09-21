import { useState, useEffect } from "react";

const KEY = "140188fc";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 👇 for us to safely write side effects
  useEffect(
    function () {
      //   callback?.();

      const controller = new AbortController();
      // to prevent race conditions when fetching as well as to minimize the amount of data downloaded and optimize performance

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          // Error handling for when connection is lost ☝️
          // I don't think it reaches this though as a different error message is displayed 🤔

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          // Error handling for when query returns no results ☝️

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
