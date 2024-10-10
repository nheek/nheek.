import React, { useEffect, useState, useRef } from "react";
import GetTextsMap from "./GetTextsMap";
import FeaturedProjectsItemItem from "./FeaturedProjectsItemItem";

export default function FeaturedProjectsItem({
  category = "websites",
}: Readonly<FeaturedProjectsItemProps>) {
  const [projectsToShow, setProjectsToShow] = useState([]);
  const [txtInfo, setTxtInfo] = useState({});
  const [projectsNo, setProjectsNo] = useState([]); // State for projects_no
  const [projects, setProjects] = useState([]); // State for projects

  // Fetch projects_no and projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const responseNo = await fetch("/featured-projects/json/projects_no.json"); // Update with the correct path
        const dataNo = await responseNo.json();
        setProjectsNo(dataNo); // Set the fetched projects_no
        console.log("projects_no.json data:", dataNo); // Log the data

        const response = await fetch("/featured-projects/json/projects.json"); // Update with the correct path
        const data = await response.json();
        setProjects(data); // Set the fetched projects
        console.log("projects.json data:", data); // Log the data
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const wwwNheekNo = {
    projectsToShowMap: projectsNo, // Use the fetched projects_no
    contributions: "disse er prosjekter jeg har bidratt til",
    static: "disse er ikke funksjonelle nettsteder/apper",
    template: "disse er nettsteder/apper jeg delvis har kodet",
    deployedWith: "deployert med",
    with: "med",
  };

  const wwwDefault = {
    projectsToShowMap: projects, // Use the fetched projects
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

  const textsMap = GetTextsMap(domainPairs);
  const divRef = useRef(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Updated useEffect for setting projectsToShow and txtInfo
  useEffect(() => {
    if (textsMap.projectsToShowMap[category]) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Safely get the projectsToShow
      const projectsToShow = textsMap.projectsToShowMap[category]?.slice(startIndex, endIndex) || [];
      setProjectsToShow(projectsToShow);
      setTxtInfo(textsMap);
    } else {
      // Handle the case when category is not found
      console.warn(`Category "${category}" not found in textsMap.projectsToShowMap`);
    }
  }, [category, currentPage, textsMap]); // Ensure textsMap is included as a dependency

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const totalPages = Math.ceil(
    (textsMap.projectsToShowMap[category]?.length || 0) / itemsPerPage
  );
  

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
          {txtInfo[category] || ""}
        </span>
        {projectsToShow.map((project, index) => (
          <FeaturedProjectsItemItem
            key={"projects-to-show-" + index}
            category={category}
            project={project}
            txtInfo={txtInfo}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex gap-4 justify-center mt-12">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`h-8 w-8 bg-[#1C2951] brightness-125 hover:brightness-[unset] hover:bg-gray-200 hover:text-blue-950 rounded-full ${
                currentPage === index + 1 ? "bg-gray-400 text-blue-950" : ""
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
