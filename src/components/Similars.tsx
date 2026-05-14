import ItemListCard from "./ItemList/ItemListCard"
import type { Movie } from "../types/movie"

interface SimilarProp {
	type: string | undefined
	similar: Movie[]
	cardRef: any
}

export default function Similars({ similar, type, cardRef } : SimilarProp) {
	return (
		<div ref={cardRef} className="relative z-40 px-4 max-w-[90%] mx-auto pb-10 md:pb-20 text-white">
			<div className="flex items-center gap-4 mb-6">
				<span className="bg-cyan-500 h-8 w-1 inline-block"></span>
				<h2 className="text-2xl md:text-3xl font-semibold font-inter">{type === "movie" ? "Movies" : "TV Shows"} you may like</h2>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
				{similar
				.filter((item) => item.poster_path)
				.slice(0, 18)
				.map((item) => (
					<ItemListCard
					key={item.id}
					item={item}
					type={type}
					/>
				))}
			</div>
		</div>
	)
}
