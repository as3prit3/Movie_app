export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 mt-2">
      <div className="w-full max-w-[90%] mx-auto py-8">

        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* LOGO / DESCRIPTION */}
          <div>
            <h2 className="text-xl font-bold mb-2">
              Cine<span className="text-cyan-500">X</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-sm">
              Discover trending movies and TV shows, explore details, and stay up to date with the latest releases.
            </p>
          </div>

          {/* LINKS */}
          <div className="flex gap-12 text-sm">
            <div>
              <h3 className="mb-2 font-semibold">Explore</h3>
              <ul className="space-y-1 text-gray-400">
                <li className="hover:text-white cursor-pointer">Home</li>
                <li className="hover:text-white cursor-pointer">Movies</li>
                <li className="hover:text-white cursor-pointer">TV Shows</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Resources</h3>
              <ul className="space-y-1 text-gray-400">
                <li className="hover:text-white cursor-pointer">API</li>
                <li className="hover:text-white cursor-pointer">Docs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Movie Explorer. Built with React & TMDB.
        </div>
      </div>
    </footer>
  );
}
