import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemListCard from "../components/ItemList/ItemListCard";
import { fetchMovieSearch } from "../services/movieApi";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function Search() {
	const [params] = useSearchParams();
	const query = params.get("q");

	const [results, setResults] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setResults([]);
		setPage(1);
		setTotalPages(1);
	}, [query]);

	// fetch
	useEffect(() => {
		if (!query) return;

		let cancelled = false; // prevents stale responses from updating state

		const fetchSearch = async () => {
			setLoading(true);
			try {
			const data = await fetchMovieSearch(query, page);
			if (cancelled) return;

			const filtered = data.results.filter((item: any) => item.poster_path);

			setResults((prev) => {
				const seen = new Set(
				prev.map((item) => `${item.id}-${item.media_type ?? "movie"}`)
				);
				return [
				...prev,
				...filtered.filter(
					(item: any) => !seen.has(`${item.id}-${item.media_type ?? "movie"}`)
				),
				];
			});

			setTotalPages(data.total_pages);
			} finally {
			if (!cancelled) setLoading(false);
			}
		};

		fetchSearch();
		return () => { cancelled = true; };
	}, [query, page]);

	// infinite scroll
	useEffect(() => {
		const handleScroll = () => {
			if (
			window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
			!loading &&
			page < totalPages
			) {
			setPage((prev) => prev + 1);
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loading, page, totalPages]);

  return (
    <div className="min-h-screen bg-black text-white px-40 p-30">
      <h1 className="relative z-30 text-2xl font-bold mb-6 text-white">
        Results for "{query}"
      </h1>

      {/* RESULTS */}
		{results.length === 0 ? (
			<div className="text-center text-gray-400 mt-10 min-h-125 flex justify-center items-center">
				<p>No results found for "{query}"</p>
			</div>
			) :
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
				{results.map((item) => (
					<ItemListCard
						key={`${item.media_type}-${item.id}`}
						item={item}
						type={item.media_type}
					/>
				))}
			</div>
		}
		<ScrollToTopButton />
    </div>
  );
}
