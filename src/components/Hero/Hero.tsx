import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Movie } from "../../types/movie";
import HeroContent from "./HeroContent";
import { fetchPopularMovies } from "../../services/movieApi";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const x = useMotionValue(0);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchPopularMovies();
      setMovies(data.slice(0, 10));
    };

    loadMovies();
  }, []);

  useLayoutEffect(() => {
    const updateWidth = () => {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0;
      if (!width) return;

      setSlideWidth(width);
      x.set(-width);
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [x, movies.length]);

  const performSlide = (offset: -1 | 1) => {
    if (!movies.length || !slideWidth || isTransitioning) return;

    const target = offset === 1 ? -slideWidth * 2 : 0;
    setIsTransitioning(true);

    animate(x, target, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        setActiveIndex((prev) => (prev + offset + movies.length) % movies.length);
        x.set(-slideWidth);
        setIsTransitioning(false);
      },
    });
  };

  useEffect(() => {
    if (!movies.length || !slideWidth || isTransitioning) return;

    const timeout = window.setTimeout(() => {
      performSlide(1);
    }, 10000);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, isTransitioning, movies.length, slideWidth]);

  if (!movies.length) return null;

  const getMovieAtOffset = (offset: number) => {
    const index = (activeIndex + offset + movies.length) % movies.length;
    return movies[index];
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (!slideWidth || isTransitioning) return;

    const swipeOffsetThreshold = slideWidth * 0.18;
    const swipeVelocityThreshold = 650;

    if (
      info.offset.x <= -swipeOffsetThreshold ||
      info.velocity.x <= -swipeVelocityThreshold
    ) {
      performSlide(1);
      return;
    }

    if (
      info.offset.x >= swipeOffsetThreshold ||
      info.velocity.x >= swipeVelocityThreshold
    ) {
      performSlide(-1);
      return;
    }

    animate(x, -slideWidth, {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  return (
    <div ref={containerRef} className="relative isolate w-full overflow-hidden bg-black text-white">
      <motion.div
        className="flex h-full w-full cursor-grab active:cursor-grabbing select-none"
        style={{ x, touchAction: "pan-y" }}
        drag={slideWidth && !isTransitioning ? "x" : false}
        dragConstraints={slideWidth ? { left: -slideWidth * 2, right: 0 } : undefined}
        dragElastic={0.02}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full shrink-0 ">
          <HeroContent movie={getMovieAtOffset(-1)} />
        </div>
        <div className="w-full shrink-0 ">
          <HeroContent movie={getMovieAtOffset(0)} />
        </div>
        <div className="w-full shrink-0 ">
          <HeroContent movie={getMovieAtOffset(1)} />
        </div>
      </motion.div>
    </div>
  );
}
