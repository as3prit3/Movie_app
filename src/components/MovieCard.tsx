import type { Movie } from "../types/movie";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link to={`/movie/${movie.id}`}>
      <motion.div
        className="group cursor-pointer hover:shadow-xl hover:shadow-white/10"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* IMAGE CONTAINER */}
        <div className="relative overflow-hidden rounded-xl">
          <motion.img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />

          {/* GRADIENT OVERLAY */}
          <div className="
            absolute inset-0
            bg-linear-to-t from-black via-transparent to-transparent
            opacity-0 group-hover:opacity-100
            transition
          " />
        </div>

        {/* TITLE */}
        <h2 className="mt-2 text-sm font-medium group-hover:text-gray-300 transition">
          {movie.title}
        </h2>
      </motion.div>
    </Link>
  );
}
