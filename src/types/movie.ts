export interface Movie {
  id: number;
  title: string;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number
  release_date: string
  first_air_date: string
}

export interface Actor {
	id: number
	profile_path: string | null
	name: string
	character: string
}

export interface ActorsProps {
  credits: Actor[]
}

export interface ListCardProps {
  item: Movie
  type: string | undefined
}
