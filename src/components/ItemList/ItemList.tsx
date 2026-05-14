import { useEffect, useState } from "react";
import ItemListCard from "./ItemListCard";
import ItemListToggle from "./ItemLIstToggle";
import MovieCardSkeleton from "../MovieCardSkeleton"
import { motion } from "framer-motion";

export default function ItemList({ title, fetchFunction }: { title: string; fetchFunction: (endpoint: string) => Promise<{ results: any[] }> }) {
  const [type, setType] = useState<"movie" | "tv">("movie");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  let endpoint;
  if (title === "Trending")
    endpoint = type
  else
    endpoint = type === "movie" ? "movie/now_playing" : "tv/on_the_air";

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const res = await fetchFunction(endpoint)
      setData(res.results);
      setLoading(false);
    };

    fetchTrending();
  }, [type]);

  return (
    <section className="pb-12 text-white w-full max-w-[90%] mx-auto pt-8">
      {/* HEADER */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* content */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <span className="bg-cyan-500 h-8 w-1 inline-block"></span>
            <h2 className="text-2xl font-bold font-inter">{title}</h2>
          </div>

          <ItemListToggle type={type} setType={setType} />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {data.slice(0, 18).map((item) => (
                <ItemListCard key={item.id} item={item} type={type} />
            ))}
          </div>
        )}
      </motion.section>
    </section>
  );
}
