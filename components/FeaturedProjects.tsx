import { useState } from "react";
import FeaturedProjectsItem from "./FeaturedProjectsItem";
// import getTextsMap from "./utils/GetTextsMap";

export default function FeaturedProjects() {
  const [currentCategory, setCurrentCategory] = useState("websites");
  const categories = [
    "websites",
    // "desktop",
    // "mobile",
    "consulting",
    "contributions",
    "static",
    "template",
    "utility",
  ];
  const handleItemClick = (category: string): void => {
    setCurrentCategory(category);
  };

  // if there is a new project under a category, put the category here
  const newProjects = ["Utility"];

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
                {newProjects && newProjects.includes(currentCategory) && (
                  <div className="absolute -top-2 md:-top-5 -right-3 bg-green-600 transform rotate-12 px-1 py-2 rounded-full text-xs">
                    new
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
