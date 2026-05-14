import type { Actor, ActorsProps } from "../types/movie"

export default function Actors({ credits }: ActorsProps) {
	return (
		<div className="relative z-40 px-4 max-w-[90%] mx-auto py-10 md:py-20 text-white">
			<div className="flex items-center gap-4 mb-6">
				<span className="bg-cyan-500 h-8 w-1 inline-block"></span>
				<h2 className="text-2xl md:text-3xl font-semibold font-inter">Actors</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{credits.slice(0, 12).map((actor: Actor) => (
				<div
				key={actor.id}
				className=" group
					flex items-center gap-4
					p-4 rounded-2xl
					bg-white/5 backdrop-blur-md
					border border-white/10
					hover:bg-white/10 transition hover:scale-[1.02] hover:border-cyan-500/30
				"
				>
				{/* ACTOR IMAGE */}
				<img
					src={
					actor.profile_path
						? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
						: "/placeholder.png"
					}
					className="w-12 h-12 rounded-full object-cover"
				/>

				{/* TEXT */}
				<div className="flex flex-col">
					<span className="text-sm font-semibold group-hover:text-cyan-500">
					{actor.name}
					</span>

					<span className="text-xs text-gray-400">
					{actor.character}
					</span>
				</div>
				</div>
			))}
			</div>
		</div>
	)
}
