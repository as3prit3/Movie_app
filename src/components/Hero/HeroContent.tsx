import type { Movie } from "../../types/movie";
import { Link } from "react-router-dom";

interface Props {
  movie: Movie;
}

export default function HeroContent({ movie }: Props) {
  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
	<div
		className="relative h-200 w-full overflow-hidden bg-cover bg-center"
		style={{ backgroundImage: `url(${backdrop})` }}
	>
		<div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
		<div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
		<div className="absolute -left-24 -bottom-35 h-72 w-lg rounded-full bg-black/70 blur-[110px] sm:h-80 sm:w-152" />

		<div className="relative z-10 flex h-full w-full items-end">
			<div className="flex w-full max-w-[90%] flex-col gap-4 sm:gap-5 py-12 sm:py-16 md:py-20 lg:py-24 mx-auto ">
				<div className="max-w-3xl">
					<h1 className="max-w-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.05] tracking-tight">
						{movie.title}
					</h1>

					<div className="mt-4 flex flex-wrap items-center gap-3 text-sm sm:text-base">
						<div className="flex items-center gap-1">
							<span className="text-cyan-400">★</span>
							<span className="text-white/80">{movie.vote_average.toFixed(1)}</span>
						</div>
						<span className="hidden text-white/35 sm:inline">|</span>
						<span className="text-white/80">
							{movie.release_date?.substring(0, 4) || "—"}
						</span>
					</div>

					<p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg leading-5 sm:leading-6 md:leading-7 text-white/80 line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
						{movie.overview}
					</p>

					<div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center">
						<Link to={`/details/movie/${movie.id}`} className="w-full sm:w-auto">
							<button className="w-full rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-cyan-400 sm:w-auto">
								▶ Watch Now
							</button>
						</Link>
						<Link to={`/details/movie/${movie.id}`} className="w-full sm:w-auto">
							<button className="w-full rounded-xl border border-white/20 bg-white/6 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-white/12 sm:w-auto">
								See More
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	</div>
  );
}
