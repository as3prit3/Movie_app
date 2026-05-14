import { useRef } from "react";
import { motion } from "framer-motion";
interface Props {
  genres: any[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export default function GenreFilter({ genres, selected, onSelect,}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🖱️ drag scroll
  let isDown = useRef(false);;
  let startX = useRef(0);
  let scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].pageX;
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;

    const x = e.touches[0].pageX;
    const walk = (x - startX.current) * 1.5;

    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="mb-6">
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="
          flex gap-6 overflow-x-auto whitespace-nowrap
          cursor-grab active:cursor-grabbing
          no-scrollbar border-b border-white/20
        "
      >
        {/* ALL */}
        <GenreItem
          label="All"
          active={selected === null}
          onClick={() => onSelect(null)}
        />

        {genres.map((genre) => (
          <GenreItem
            key={genre.id}
            label={genre.name}
            active={selected === genre.id}
            onClick={() => onSelect(genre.id)}
          />
        ))}
      </div>
    </div>
  );
}

function GenreItem({label, active, onClick,}: { label: string; active: boolean; onClick: () => void;}) {
  return (
    <button
      onClick={onClick}
      className="relative pb-1 text-sm transition"
    >
      <span
        className={`
          ${
            active
              ? "text-white font-semibold"
              : "text-gray-500 hover:text-cyan-500"
          }
        `}
      >
        {label}
      </span>

      {/* UNDERLINE */}
      {active && (
        <motion.span
          layoutId="genreUnderline"
          className="absolute left-0 bottom-0 h-0.5 w-full bg-cyan-500"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}
