import type { ListCardProps } from "../../types/movie";
import { Link } from "react-router-dom";

export default function ItemListCard({ item, type }: ListCardProps) {
  const title = type === "movie" ? item.title : item.name;
  const date = type === "movie" ? item.release_date : item.first_air_date;
  const label = type === "tv" ? "TV Show" : "Movie";
  const year = date ? date.split("-")[0] : "N/A";

  return (
    <Link to={`/details/${type}/${item.id}`}>
      <div className="cursor-pointer group">
        <div className="overflow-hidden rounded-xl mb-2 relative">
          <img
            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
            className="w-full transition-transform duration-300 group-hover:scale-110"
          />
          <span
            className="
              absolute top-2 left-2 font-inter
              text-xs px-2 py-1 rounded-md
              bg-black/40 backdrop-blur-sm
              border border-white/20
              text-white font-medium
            "
          >
            {label}
          </span>
        </div>

        <h3 className="text-sm font-medium font-inter mb-2 line-clamp-1 group-hover:text-cyan-500 group-hover:font-semibold">
          {title}
        </h3>

        <div className="text-xs text-gray-400 flex justify-between">
          <div className="flex items-center gap-0.5">
            <span className="text-cyan-500 text-md">★</span>
            <span>{item.vote_average.toFixed(1)}</span>
          </div>
          <span>{year}</span>
        </div>
      </div>
    </Link>
  );
}
