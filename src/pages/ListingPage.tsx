import { useEffect, useState } from "react";
import ItemListCard from "../components/ItemList/ItemListCard";
import GenreFilter from "../components/Listing/GenreFilter";
import MovieCardSkeleton from "../components/MovieCardSkeleton"
import ScrollToTopButton from "../components/ScrollToTopButton";
import { fetchMovieGenre, fetchMovieItem } from "../services/movieApi";

interface Props {
  type: "movie" | "tv";
}

export default function ListingPage({ type }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      const data = await fetchMovieGenre(type)
      setGenres(data.genres);
    };

    fetchGenres();
  }, [type]);

  // 🔥 Fetch content
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      const genreQuery = selectedGenre
        ? `&with_genres=${selectedGenre}`
        : "";

      const data = await fetchMovieItem(type, page, genreQuery)

      setItems((prev) => [...prev, ...data.results]);
      setTotalPages(data.total_pages);

      setLoading(false);
    };

    fetchItems();
  }, [type, page, selectedGenre]);

  // 🔥 Reset when filter changes
  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [selectedGenre]);

  // 🔥 Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        page < totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, totalPages]);

  return (
    <div className="min-h-screen bg-black text-white px-4 max-w-[90%] mx-auto py-10 md:py-30">
      <h1 className="relative z-40 text-2xl md:text-3xl font-bold mb-6 capitalize">
        {type === "movie" ? "Movies" : "TV Shows"}
      </h1>

      {/* FILTER */}
      <GenreFilter genres={genres} selected={selectedGenre} onSelect={setSelectedGenre}/>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-10">
          {items.map((item) => (
            <ItemListCard key={`${item.id}-${type}`} item={item} type={type} />
          ))}
        </div>
      )}
	  <ScrollToTopButton />
    </div>
  );
}
