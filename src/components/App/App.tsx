import css from "./App.module.css";
import toast from "react-hot-toast";

import { useState } from "react";
import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setError(false);
    setIsLoading(true);
    try {
      const movies = await fetchMovies(query);
      if (movies.length === 0) {
        toast("No movies found for your request.");
        return;
      }
      console.log(movies);
      setMovies(movies);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };
  return (
    <>
      <Toaster></Toaster>
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch}></SearchBar>
        {isLoading && <Loader></Loader>}
        {error && <ErrorMessage></ErrorMessage>}

        {!isLoading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelect}></MovieGrid>
        )}
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
}
