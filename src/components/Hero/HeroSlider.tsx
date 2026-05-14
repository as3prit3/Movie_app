import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";

interface MovieItem {
  id: number;
  poster_path: string;
  realIndex: number;
  position: number;
}

interface Props {
  movies: MovieItem[];
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  setDirection: (dir: number) => void;
}

export default function HeroSlider({ movies, setActiveIndex, setDirection }: Props) {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6">
      <div
        className="flex justify-center px-2
        rounded-2xl
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        shadow-lg"

      >
        {movies.map((movie) => {
          const isCenter = movie.position === 0;
          const absPos = Math.abs(movie.position);

          return (
            <motion.div
              key={movie.id}
              onClick={() => {
                if (movie.position > 0) {
                  setDirection(1);
                  setActiveIndex((prev) => (prev + 1) % 10);
                } else if (movie.position < 0) {
                  setDirection(-1);
                  setActiveIndex((prev) => (prev === 0 ? 9 : prev - 1));
                }
              }}
              className={`cursor-pointer shrink-0 ${absPos > 3 ? "hidden" : "block"}`}
              animate={{
                scale: isCenter ? 1.15 : 0.85,
                opacity: isCenter ? 1 : 0.65,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt="poster"
                className={`object-cover rounded-xl transition-all duration-300 border ${
                  isCenter ? "border-2 border-white/80 mx-2" : "border border-white/10"
                } w-22 h-40 sm:w-33 sm:h-50 md:w-44 md:h-60 lg:w-55 lg:h-80`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
