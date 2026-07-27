import css from "./App.module.css";
import toast from "react-hot-toast";

import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie";

import SearchBar from "../SearchBar/SearchBar";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

// Далі в jsx використувуємо компонент ReactPaginate звичайним чином.
//Пагінація
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (nextPage: number) => void;
}

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // робимо запит з серверу за домогою useQuery
  const { data, isLoading, error, isSuccess, isFetched } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  //використовуємо useEffect для перевірки чи не пуста відповідь від серверу.
  useEffect(() => {
    if (isFetched && isSuccess && movies.length === 0) {
      toast("No movies found for your request.");
    }
  }, [isFetched, isSuccess, movies]);

  const handleSearch = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
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

        {totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
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
