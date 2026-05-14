import ListingPage from "./ListingPage";
import { motion } from "framer-motion";

export default function TvShows() {
  return (
	<motion.div
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
	  transition={{duration: 0.3}}
    >
		<ListingPage type="tv" />;
	</motion.div>
  )
}
