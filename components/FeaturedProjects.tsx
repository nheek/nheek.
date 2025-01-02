import { useState } from "react";
import FeaturedProjectsItem from "./FeaturedProjectsItem";
import getTextsMap from "./utils/GetTextsMap";

export default function FeaturedProjects() {
  const [currentCategory, setCurrentCategory] = useState("websites");
  const categories = [
    "websites",
    "desktopApps",
    "mobileApps",
    "consulting",
    "contributions",
    "static",
    "template",
    "utility",
  ];
  const handleItemClick = (category: string): void => {
    setCurrentCategory(category);
  };
  const wwwNheekNo = {
    featuredProjects: "utvalgte prosjekter",
    websites: "Nettsteder",
    desktopApps: "Desktop Apper",
    mobileApps: "Mobile Apper",
    consulting: "Konsulent",
    contributions: "Contributions",
    static: "Statisk",
    template: "Mal",
    utility: "Verktøy",
    new: "nytt",
  };
  const wwwDefault = {
    featuredProjects: "featured projects",
    websites: "Websites",
    desktopApps: "Desktop Apps",
    mobileApps: "Mobile Apps",
    consulting: "Consulting",
    contributions: "Contributions",
    static: "Static",
    template: "Template",
    utility: "Utility",
    new: "new",
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };
  const textsMap = getTextsMap(domainPairs);

  // if there is a new project under a category, put the category here
  const newProjects = ["Utility"];

  return (
    <section className="px-4 pt-[20%] md:pt-[10%]">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[6rem]">
        {textsMap.featuredProjects}
      </hgroup>
      <section className="my-8 md:mt-14 md:ml-6">
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li
              key={category}
              className={`${currentCategory === category ? "bg-gray-400 text-blue-950" : ""} bg-[#1C2951] brightness-125 hover:brightness-[unset] hover:-rotate-6 rounded-3xl hover:bg-gray-200 hover:text-blue-950 duration-500`}
            >
              <button
                className="relative w-full h-full px-3 py-2"
                onClick={() => handleItemClick(category)}
              >
                {textsMap[category]}
                {newProjects && newProjects.includes(textsMap[category]) && (
                  <div className="absolute -top-2 md:-top-5 -right-3 bg-green-600 transform rotate-12 px-1 py-2 rounded-full text-xs">
                    {textsMap.new}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <FeaturedProjectsItem category={currentCategory} />
    </section>
  );
}
