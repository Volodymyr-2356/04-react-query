import type { Movie } from "../types/movie";

import axios from "axios";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
console.log(TOKEN);

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const url = "https://api.themoviedb.org/3/search/movie";

export default async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get<FetchMoviesResponse>(url, {
    params: {
      query,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data.results;
}
