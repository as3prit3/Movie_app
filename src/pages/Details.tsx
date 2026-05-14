import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { Button } from "../components/ui/button";
import { FaPlay } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import Actors from "../components/Actors";
import Similars from "../components/Similars";
import { motion } from "framer-motion";
import { fetchMediaDetails } from "../services/movieApi";
import EpisodesSection from "../components/EpisodesSection";


export default function Details() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const cardRef = useRef<any>(null)

  const [data, setData] = useState<any>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [credits, setCredits] = useState<any[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [images, setImages] = useState<any>({});
  const [showContent, setShowContent] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {
    const fetchDetails = async () => {
      const { details, videos, creditsData, similarData, imagesData } = await fetchMediaDetails(type, id);
      const trailer = videos.results.find(
        (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      console.log(imagesData)
      setData(details);
      setVideoKey(trailer?.key || null);
      setCredits(creditsData.cast || []);
      setSimilar(similarData.results || []);
      setImages(imagesData || {})
    };

    fetchDetails();
  }, [id, type]);

  if (!data) return null;

  const title = data.title || data.name;
  const year = (data.release_date || data.first_air_date)?.split("-")[0];
  const rating = data.vote_average?.toFixed(1);
  const backdrop = `https://image.tmdb.org/t/p/original${data.backdrop_path}`
  const logo = images.logos?.find((l: any) => l.iso_639_1 === "en") ?? images.logos?.[0];
  const logoUrl = logo ? `https://image.tmdb.org/t/p/w500${logo.file_path}` : null;
  const duration = data.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
    : null;

  function jumpToSimilar() {
    cardRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMouseEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowContent(true);
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => {
      setShowContent(false);
    }, 6000);
  };

  return (
    <div className="bg-black h-full w-full">
      <div className="bg-black w-full text-white h-200 relative">

        {/* 🎬 TRAILER BACKGROUND */}
        {videoKey ? (
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              className="
                absolute top-1/2 left-1/2
                w-full h-screen
                min-w-full min-h-full
                -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                opacity-50 scale-115
              "
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${
                muted ? 1 : 0
              }&controls=0&loop=1&playlist=${videoKey}`}
              allow="autoplay"
            />
          </div>
        ) : (
           <motion.div
              className="absolute inset-0 bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${backdrop})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >

            </motion.div>
        )}

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

        {/* NAV BUTTONS */}
        <div className="absolute top-6 left-6 z-50 pl-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 p-3 rounded-full backdrop-blur border border-white/20 hover:bg-white/20 cursor-pointer transform duration-300"
          >
            <ArrowLeft className="opacity-80"/>
          </button>
        </div>

        <div className="absolute top-6 right-6 z-50 pr-4 pt-4">
          <button
            onClick={() => setMuted((m) => !m)}
            className="bg-white/10 p-3 rounded-full backdrop-blur border border-white/20 hover:bg-white/20 cursor-pointer transform duration-300"
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
        </div>

        {/* CONTENT */}
        <div className="absolute bottom-0 z-40 flex items-end mx-[6%] pb-10 group transform duration-300 ease-in-out"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-2xl space-y-4">

            {/* TITLE */}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={title}
                className="w-40 md:w-sm object-contain drop-shadow-lg"
              />
            ) : (
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-inter font-bold">{title}</h1>
            )}

            {/* META */}
            <div className={`text-sm text-gray-300 gap-3 opacity-90 flex transition-all duration-600 ease-in-out overflow-hidden
              ${showContent ? "max-h-20 opacity-90" : "max-h-0 opacity-0 pointer-events-none"}`}>
              <div className="flex gap-0.5">
                <span className="text-cyan-500 text-md">★</span>
                <span>{rating}</span>
              </div>
              <span>•</span>
              <span>{year}</span>
              {type === "movie" && duration && <span>•</span> && <span>{duration}</span>}
            </div>

            {/* GENRES */}
            <div className={`gap-2 flex-wrap opacity-90 flex transition-all duration-600 ease-in-out overflow-hidden
              ${showContent ? "max-h-20 opacity-90" : "max-h-0 opacity-0 pointer-events-none"}`}>
              {data.genres?.map((g: any) => (
                <span
                  key={g.id}
                  className="px-2 py-1 text-xs bg-white/10 rounded"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* DESCRIPTION */}
            <p className={`text-gray-300 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 transition-all duration-600 ease-in-out overflow-hidden
              ${showContent ? "max-h-40 opacity-90" : "max-h-0 opacity-0 pointer-events-none"}`}>
              {data.overview}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-4 items-center">
              <Button size="lg" className="bg-white/90 hover:bg-white transform duration-300 text-black px-8 py-6 font-semibold rounded-full cursor-pointer">
                <FaPlay /> Play
              </Button>

              <Button
                onClick={() => jumpToSimilar()}
                size="lg" className="bg-white/10 px-6 py-5 border border-white/30 rounded-full cursor-pointer hover:bg-[#373A3D] transform duration-300"
              >
                <BsStars /> Similar
              </Button>
            </div>
          </div>
        </div>
      </div>


      {type === "tv" && <EpisodesSection tvId={id!} />}
      <Actors credits={credits}/>
      <Similars similar={similar} type={type} cardRef={cardRef}/>
    </div>
  );
}
