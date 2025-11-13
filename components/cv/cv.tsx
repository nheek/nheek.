import React from "react";

export interface CVEntry {
  id: number;
  company: string;
  position: string;
  date_from: string;
  date_to: string | null;
  present: boolean;
  link: string;
  description: string;
  location: string;
}

// Helper to format date as 'MMM YYYY' (e.g. 'Nov 2025')
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr as string);
  if (isNaN(date.getTime())) return dateStr || "";
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export default function CV({ entries }: { entries: CVEntry[] }) {
  return (
    <section className="w-full md:w-[80%] lg:w-[65%] xl:w-[55%] mx-auto mt-14 md:mt-20 mb-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center text-indigo-200">
          cv / resume
        </h2>
        <p className="text-slate-300 text-lg mb-6">
          professional experience & work history
        </p>
      </div>
      <div className="space-y-10">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-xl bg-indigo-950/70 border border-indigo-900/40 p-6 md:p-8 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-200 mb-1">
                  {entry.position}
                </h2>
                <div className="text-sm text-indigo-400 font-normal mb-1">
                  {entry.company}
                </div>
                {entry.link && (
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-400 hover:underline break-all"
                  >
                    {entry.link}
                  </a>
                )}
              </div>
              <div className="text-sm text-indigo-300 mt-2 md:mt-0 md:text-right">
                {entry.location}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-950/30 py-1 rounded">
                {formatDate(entry.date_from)} –{" "}
                {entry.present ? "Present" : formatDate(entry.date_to)}
              </span>
            </div>
            <p className="text-indigo-100 leading-relaxed mt-2 text-base">
              {entry.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
