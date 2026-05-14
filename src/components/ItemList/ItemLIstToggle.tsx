interface Props {
  type: "movie" | "tv";
  setType: (type: "movie" | "tv") => void;
}

export default function ItemListToggle({ type, setType }: Props) {
  return (
    <div className="relative flex bg-white/10 rounded-full p-1">
      <span
        className={`absolute top-1 bottom-1 w-[calc(50%-0.40rem)] rounded-full bg-cyan-500 transition-transform duration-300 ease-out ${
          type === "movie" ? "translate-x-0" : "translate-x-full"
        }`}
      />

      <button
        onClick={() => setType("movie")}
        className={`relative z-10 px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
          type === "movie" ? "text-white" : "text-white/70"
        }`}
      >
        Movies
      </button>

      <button
        onClick={() => setType("tv")}
        className={`relative z-10 px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
          type === "tv" ? "text-white" : "text-white/70"
        }`}
      >
        TV Shows
      </button>
    </div>
  );
}
