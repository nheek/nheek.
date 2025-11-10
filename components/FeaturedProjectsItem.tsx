"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import FeaturedProjectsItemItem from "./FeaturedProjectsItemItem";

interface Project {
  id: string;
  name?: string;
  codename?: string;
  desc?: string;
  description?: string;
  image?: string;
  githubLink?: string;
  liveLink?: string;
  dateAdded?: string;
  featured?: boolean;
}

export default function FeaturedProjectsItem({
  category = "websites",
  projects,
}: FeaturedProjectsItemProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const divRef = useRef(null);
  const itemsPerPage = 10;

  const filteredProjects = useMemo(() => {
    if (projects && typeof projects === "object") {
      return Array.isArray(projects[category]) ? projects[category] : [];
    }
    return [];
  }, [projects, category]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProjects.length / itemsPerPage);
  }, [filteredProjects, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    if (currentPage > 1 && divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div
        ref={divRef}
        className="relative text-3xl leading-snug flex flex-col items-center justify-center gap-[7%] flex-wrap"
      >
        {paginatedProjects.map((project, index) => (
          <FeaturedProjectsItemItem
            id={index}
            key={project.id || `projects-to-show-${index}`}
            project={project}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex gap-4 justify-center mt-12">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`cursor-pointer h-8 w-8  brightness-125 hover:brightness-[unset] hover:bg-gray-200 hover:text-blue-950 rounded-full ${
                currentPage === index + 1
                  ? "bg-slate-400 text-blue-950"
                  : "bg-blue-950 text-gray-50"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

interface FeaturedProjectsItemProps {
  category?: string;
  projects: Record<string, Project[]>;
}
