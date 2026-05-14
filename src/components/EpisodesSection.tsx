import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface Props {
  tvId: string;
}

export default function EpisodesSection({ tvId }: Props) {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [searchEpisode, setSearchEpisode] = useState("");

  // 🔥 Fetch seasons
  useEffect(() => {
    const fetchSeasons = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}`
      );
      const data = await res.json();

      setSeasons(data.seasons || []);
      setSelectedSeason(data.seasons?.[0]?.season_number || 1);
    };

    fetchSeasons();
  }, [tvId]);

  // 🔥 Fetch episodes
  useEffect(() => {
    if (!selectedSeason) return;

    const fetchEpisodes = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}/season/${selectedSeason}?api_key=${API_KEY}`
      );

      const data = await res.json();
      setEpisodes(data.episodes || []);
    };

    fetchEpisodes();
  }, [selectedSeason, tvId]);

  return (
    <div className="relative z-40 px-4 max-w-[90%] mx-auto w-full text-white ">
      <div className="flex items-center gap-4 mb-6">
        <span className="bg-cyan-500 h-8 w-1 inline-block"></span>
        <h2 className="text-2xl font-semibold font-inter">Episodes</h2>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-4 mb-6 max-w-150">
        {/* SEASON */}
        <Select
          value={String(selectedSeason)}
          onValueChange={(value) => setSelectedSeason(Number(value))}
        >
          <SelectTrigger className="
            w-40
            bg-[#0B0F14] border border-white/10
            rounded-xl
          ">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>

          <SelectContent className="bg-[#0B0F14] border border-white/10 text-white SelectContent" position="popper">
            {seasons.map((season) => (
              <SelectItem
                key={season.id}
                value={String(season.season_number)}
                className=" text-white/60 focus:bg-white/40"
              >
                Season {season.season_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* SEARCH */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search episode..."
            value={searchEpisode}
            onChange={(e) => setSearchEpisode(e.target.value)}
            className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4 max-h-125 overflow-y-auto pr-2 custom-scroll">
        {episodes
          .filter((ep) =>
            ep.name.toLowerCase().includes(searchEpisode.toLowerCase())
          )
          .map((ep) => (
            <div
              key={ep.id}
              className="
                flex items-center justify-between
                p-4 rounded-2xl
                bg-[#0B0F14] border border-white/10
                hover:border-cyan-500/50 hover:bg-white/5
                transition
              "
            >
              <div className="flex gap-4 group">
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={
                      ep.still_path
                        ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                        : "/placeholder.png"
                    }
                    className="w-35 h-20 object-cover rounded-lg"
                  />

                  <div className="absolute bottom-1 left-1 bg-black/70 text-xs px-2 py-0.5 rounded">
                    {ep.episode_number}
                  </div>
                </div>

                {/* TEXT */}
                <div className="w-full">
                  <h3 className="text-sm font-semibold group-hover:text-cyan-500">{ep.name}</h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {ep.runtime || 45} min
                  </p>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                    {ep.overview || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
