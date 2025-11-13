export default async function Links() {
  // SSR fetch to API route
  // Use absolute URL for SSR fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  // SSR fetch with indefinite cache
  const res = await fetch(`${baseUrl}/api/links`, {
    next: { revalidate: false },
  });
  const data = await res.json();
  const links = (data.links || []).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full md:w-[85%] lg:w-[75%] mx-auto mt-12 md:mt-20 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {links.map((link, index) => (
          <a
            key={"link" + index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 hover:border-yellow-500/50 !no-underline"
          >
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-amber-500/0 group-hover:from-yellow-500/10 group-hover:to-amber-500/10 transition-all duration-300" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300 capitalize">
                  {link.name}
                </h3>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-yellow-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                {link.desc}
              </p>

              {/* URL preview */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-xs text-gray-500 group-hover:text-yellow-300 transition-colors duration-300 truncate">
                  {(link.url || "")
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </p>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        ))}
      </div>
    </div>
  );
}
