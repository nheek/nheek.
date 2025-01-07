import React, { useEffect, useState, useRef, useMemo } from "react";
import GetTextsMap from "./utils/GetTextsMap";
import FeaturedProjectsItemItem from "./FeaturedProjectsItemItem";

export default function FeaturedProjectsItem({
  category = "websites",
}: Readonly<FeaturedProjectsItemProps>) {
  const [projectsToShow, setProjectsToShow] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectsNo, setProjectsNo] = useState([]);

  // fetch projects_no and projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/featured-projects/json/projects.json");
        const data = await response.json();
        setProjects(data);
        const responseNo = await fetch(
          "/featured-projects/json/projects_no.json",
        );
        const dataNo = await responseNo.json();
        setProjectsNo(dataNo);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const wwwNheekNo = {
    projectsToShowMap: projectsNo,
    contributions: "disse er prosjekter jeg har bidratt til",
    static: "disse er ikke funksjonelle nettsteder/apper",
    template: "disse er nettsteder/apper jeg delvis har kodet",
    deployedWith: "deployert med",
    with: "med",
  };
  const wwwDefault = {
    projectsToShowMap: projects,
    contributions: "these are projects i have contributed to",
    static: "these are non-functional websites/applications",
    template: "these are websites/apps i partially coded",
    deployedWith: "deployed with",
    with: "with",
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };
  const textsMap = useMemo(
    () => GetTextsMap(domainPairs),
    [projects, projectsNo],
  );
  const divRef = useRef(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (textsMap?.projectsToShowMap?.[category]) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const projectsToShow =
        textsMap?.projectsToShowMap?.[category]?.slice(startIndex, endIndex) ||
        [];
      setProjectsToShow(projectsToShow);
    } else {
      console.warn(`Category "${category}" not found in projectsToShowMap`);
    }
  }, [category, currentPage, textsMap]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const totalPages = useMemo(() => {
    const projectsInCategory = textsMap?.projectsToShowMap?.[category] || [];
    return Math.ceil(projectsInCategory.length / itemsPerPage);
  }, [textsMap, category, itemsPerPage]);

  useEffect(() => {
    if (currentPage > 1 && divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div
        ref={divRef}
        className="relative text-3xl leading-snug flex flex-col md:flex-row items-center justify-center gap-[7%] flex-wrap"
      >
        <span className="text-lg mb-8 md:mb-0 mt-4 md:mt-0 md:absolute top-0 italic opacity-60">
          {textsMap?.[category]?.contributions || ""}
        </span>
        {projectsToShow.map((project, index) => (
          <FeaturedProjectsItemItem
            key={"projects-to-show-" + index}
            category={category}
            project={project}
            txtInfo={textsMap}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex gap-4 justify-center mt-12">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`h-8 w-8 bg-blue-950 text-gray-50 brightness-125 hover:brightness-[unset] hover:bg-gray-200 hover:text-blue-950 rounded-full ${
                currentPage === index + 1 ? "!bg-gray-400 !text-blue-950" : ""
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
}
