import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";

type SearchItem = {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_average: number;
};

type GenreMap = Record<number, string>;

const SEARCH_DEBOUNCE_MS = 300;
const MAX_SUGGESTIONS = 3;
const MAX_GENRES = 2;

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [movieGenres, setMovieGenres] = useState<GenreMap>({});
  const [tvGenres, setTvGenres] = useState<GenreMap>({});
  const navigate = useNavigate();
  const location = useLocation();
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      if (!apiKey) return;

      const [movieRes, tvRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`),
      ]);

      const movieData = await movieRes.json();
      const tvData = await tvRes.json();

      const movieMap: GenreMap = {};
      const tvMap: GenreMap = {};

      movieData.genres?.forEach((genre: { id: number; name: string }) => {
        movieMap[genre.id] = genre.name;
      });
      tvData.genres?.forEach((genre: { id: number; name: string }) => {
        tvMap[genre.id] = genre.name;
      });

      setMovieGenres(movieMap);
      setTvGenres(tvMap);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      if (!apiKey) return;

      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      const filtered = (data.results || [])
        .filter(
          (item: SearchItem) =>
            (item.media_type === "movie" || item.media_type === "tv") && item.poster_path
        )
        .slice(0, MAX_SUGGESTIONS);

      setSuggestions(filtered);
      setShowDropdown(true);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/movies", label: "Movies" },
      { to: "/tv", label: "TV Shows" },
    ],
    []
  );

  const getYear = (item: SearchItem) => {
    const date = item.release_date || item.first_air_date;
    return date ? date.split("-")[0] : "N/A";
  };

  const getGenres = (item: SearchItem) => {
    const map = item.media_type === "tv" ? tvGenres : movieGenres;
    return item.genre_ids
      ?.map((id) => map[id])
      .filter(Boolean)
      .slice(0, MAX_GENRES);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setMobileSearchOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowDropdown(false);
    setMobileSearchOpen(false);
  };

  const navIconClass = "h-5 w-5";
  const mobileLinkClass = (active: boolean, dimWhenSearchOpen = false) =>
    [
      "flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition-all duration-200",
      active
        ? "bg-white/10 text-cyan-400 shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_10px_30px_rgba(0,0,0,0.25)]"
        : dimWhenSearchOpen
          ? "text-white/55"
          : "text-white/70 hover:bg-white/10 hover:text-cyan-400 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]",
    ].join(" ");

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="absolute inset-0 border-b border-white/10 bg-black/70 backdrop-blur-2xl" />

      <nav className="relative mx-auto max-w-[90%] hidden w-full items-center justify-between gap-6 py-4 text-white md:flex">
        <Link to="/" className="shrink-0 text-xl font-bold tracking-wide transition hover:text-cyan-500">
          🎬 Cine<span className="text-cyan-500">X</span>
        </Link>

        <div ref={desktopSearchRef} className="relative w-full max-w-md">
          <form onSubmit={handleSearch}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(Boolean(query.trim()))}
              placeholder="Search movies or TV shows..."
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:outline-none"
            />
          </form>

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl">
              {suggestions.map((item) => (
                <Link
                  key={`${item.media_type}-${item.id}`}
                  to={`/details/${item.media_type}/${item.id}`}
                  onClick={clearSearch}
                >
                  <div className="flex cursor-pointer gap-3 p-3 transition hover:bg-white/10">
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                      className="h-16 w-12 rounded object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold leading-tight">
                        {item.title || item.name}
                      </div>

                      <div className="mt-1 text-xs text-white/55">
                        {item.media_type === "tv" ? "TV Show" : "Movie"}
                        <span className="px-1 text-white/25">|</span>
                        {getYear(item)}
                        <span className="px-1 text-white/25">|</span>
                        <span className="text-cyan-500">★</span>
                        <span>{item.vote_average.toFixed(1)}</span>
                      </div>

                      {getGenres(item)?.length ? (
                        <div className="mt-1 truncate text-xs text-white/45">
                          {getGenres(item)?.join(" • ")}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-8 text-sm font-semibold lg:gap-10">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="transition hover:text-cyan-500">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="fixed inset-x-0 bottom-3 z-50 px-3 md:hidden">
        {mobileSearchOpen && (
          <div
            ref={mobileSearchRef}
            className="mb-1 rounded-3xl border border-white/10 bg-black/65 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-3xl"
          >
            <form onSubmit={handleSearch} className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowDropdown(Boolean(query.trim()))}
                placeholder="Search movies or TV shows..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-500/50 focus:outline-none"
              />

              {showDropdown && suggestions.length > 0 && (
                <div className="absolute bottom-full left-0 mb-4 max-h-72 w-full overflow-auto rounded-2xl border border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl">
                  {suggestions.map((item) => (
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      to={`/details/${item.media_type}/${item.id}`}
                      onClick={clearSearch}
                    >
                      <div className="flex cursor-pointer gap-3 p-3 transition hover:bg-white/10">
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={item.title || item.name}
                          className="h-16 w-12 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold leading-tight text-white">
                            {item.title || item.name}
                          </div>
                          <div className="mt-1 text-xs text-white/55">
                            {item.media_type === "tv" ? "TV Show" : "Movie"}
                            <span className="px-1 text-white/25">|</span>
                            {getYear(item)}
                            <span className="px-1 text-white/25">|</span>
                            <span className="text-cyan-500">★</span>
                            <span>{item.vote_average.toFixed(1)}</span>
                          </div>
                          {getGenres(item)?.length ? (
                            <div className="mt-1 truncate text-xs text-white/45">
                              {getGenres(item)?.join(" • ")}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}

        <div className="mx-auto flex max-w-[80%] items-center justify-between rounded-[1.75rem] border border-white/10 bg-black/65 px-3 py-2 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
          <Link to="/" className={mobileLinkClass(location.pathname === "/" && !mobileSearchOpen, mobileSearchOpen)} aria-current={location.pathname === "/" && !mobileSearchOpen ? "page" : undefined}>
            <svg className={navIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
            <span>Home</span>
          </Link>

          <Link to="/movies" className={mobileLinkClass(location.pathname.startsWith("/movies") && !mobileSearchOpen, mobileSearchOpen)} aria-current={location.pathname.startsWith("/movies") && !mobileSearchOpen ? "page" : undefined}>
            <svg className={navIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 5h16v14H4z" />
              <path d="M8 5v14" />
              <path d="M16 5v14" />
            </svg>
            <span>Movies</span>
          </Link>

          <Link to="/tv" className={mobileLinkClass(location.pathname.startsWith("/tv") && !mobileSearchOpen, mobileSearchOpen)} aria-current={location.pathname.startsWith("/tv") && !mobileSearchOpen ? "page" : undefined}>
            <svg className={navIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 6h16v12H4z" />
              <path d="m9 10 5 2-5 2z" />
            </svg>
            <span>TV</span>
          </Link>
          
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-pressed={mobileSearchOpen}
            className={mobileLinkClass(mobileSearchOpen)}
          >
            <svg className={navIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span>Search</span>
          </button>

        </div>
      </div>
    </header>
  );
}
