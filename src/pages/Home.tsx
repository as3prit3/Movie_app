import { motion } from "framer-motion";
import Hero from "../components/Hero/Hero";
import ItemList from "../components/ItemList/ItemList";
import { fetchTrendingMovies, fetchLatestMoviesOrTv } from "../services/movieApi";
import Footer from "../components/Footer";

export default function Home() {

  return (
    <motion.div
      className="h-[80%] bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{duration: 0.3}}
    >
      <Hero />
      <ItemList title="Trending" fetchFunction={fetchTrendingMovies}/>
      <ItemList title="Latest" fetchFunction={fetchLatestMoviesOrTv}/>
      <Footer/>
    </motion.div>
  );
}
