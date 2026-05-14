const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (id : number) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}}?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data;
};

export const fetchTrendingMovies = async (type: string) => {
  const response = await fetch(
    `${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data;
};

export const fetchMovieSearch = async (query: string, page: number) => {
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data;
};

export const fetchLatestMoviesOrTv = async (endpoint : string) => {
  const response = await fetch(
    `${BASE_URL}/${endpoint}?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data;
};

export const fetchMovieGenre= async (type : string) => {
  const response = await fetch(
    `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data;
};

export const fetchMovieItem= async (type : string, page : number, genreQuery: string) => {
  const response = await fetch(
    `${BASE_URL}/discover/${type}?api_key=${API_KEY}&page=${page}${genreQuery}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data;
};

export const fetchMediaDetails = async (type: string | undefined, id: string | undefined) => {
  const [detailsRes, videosRes, creditsRes, similarRes, imagesRes] = await Promise.all([
    fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`),
    fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`),
    fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`),
    fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`),
    fetch(`${BASE_URL}/${type}/${id}/images?api_key=${API_KEY}`)
  ]);

  if (!detailsRes.ok) throw new Error("Failed to fetch details");
  if (!videosRes.ok) throw new Error("Failed to fetch videos");
  if (!creditsRes.ok) throw new Error("Failed to fetch credits");
  if (!similarRes.ok) throw new Error("Failed to fetch similar");

  const [details, videos, creditsData, similarData, imagesData] = await Promise.all([
    detailsRes.json(),
    videosRes.json(),
    creditsRes.json(),
    similarRes.json(),
    imagesRes.json()
  ]);

  return { details, videos, creditsData, similarData, imagesData };
};
