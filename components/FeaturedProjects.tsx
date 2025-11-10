"use client";

import { useState, useEffect, useMemo } from "react";
import FeaturedProjectsItem from "./FeaturedProjectsItem";

interface Project {
  name: string;
  dateAdded?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function FeaturedProjects() {
  const [currentCategory, setCurrentCategory] = useState("websites");
  const [projects, setProjects] = useState<Record<string, Project[]>>({});

  // Get categories from the projects data
  const categories = useMemo(() => {
    return Object.keys(projects).length > 0
      ? Object.keys(projects)
      : [
          "websites",
          "consulting",
          "contributions",
          "static",
          "template",
          "utility",
        ];
  }, [projects]);

  const handleItemClick = (category: string): void => {
    setCurrentCategory(category);
  };

  // Load projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        const apiProjects = data.projects || [];

        // Group projects by category
        const groupedProjects: Record<string, Project[]> = {};
        apiProjects.forEach((project: any) => {
          const categorySlug = project.category_slug || "uncategorized";
          if (!groupedProjects[categorySlug]) {
            groupedProjects[categorySlug] = [];
          }
          groupedProjects[categorySlug].push({
            name: project.title,
            codename: project.codename,
            description: project.description,
            image: project.image_url,
            githubLink: project.github_link,
            liveLink: project.live_link,
            dateAdded: project.date_added,
            featured: project.featured === 1,
          });
        });

        setProjects(groupedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects({});
      }
    };
    fetchProjects();
  }, []);

  // Function to check if a project is new (added within last 30 days)
  const isProjectNew = (dateAdded?: string): boolean => {
    if (!dateAdded) return false;

    const today = new Date();
    const projectDate = new Date(dateAdded.split(".").reverse().join("-")); // Convert DD.MM.YYYY to YYYY-MM-DD
    const diffTime = today.getTime() - projectDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 30; // Consider new if added within last 30 days
  };

  // Get count of new projects for each category
  const newProjectsCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    Object.entries(projects).forEach(([category, categoryProjects]) => {
      const newCount = categoryProjects.filter((project) =>
        isProjectNew(project.dateAdded),
      ).length;
      counts[category] = newCount;
    });

    return counts;
  }, [projects]);

  console.log(currentCategory);
  return (
    <div className="w-[85%] mt-40 mx-auto">
      <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center">
        featured projects
      </h2>
      <div className="my-8 md:mt-14 mb-0 md:mb-20">
        <ul className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <li
              key={category}
              className={`${currentCategory === category ? "bg-blue-900" : "bg-gray-400 dark:bg-gray-800"} text-slate-50 dark:text-slate-200 rounded-full hover:bg-gray-200 hover:text-blue-950 duration-500`}
            >
              <button
                className="relative w-full h-full px-3 py-2"
                onClick={() => handleItemClick(category)}
              >
                {category}
                {newProjectsCounts[category] > 0 && (
                  <div className="absolute -top-2 md:-top-5 -right-3 bg-green-600 transform rotate-12 px-1 py-2 rounded-full text-xs">
                    {newProjectsCounts[category]} new
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <FeaturedProjectsItem category={currentCategory} />
    </div>
  );
}
