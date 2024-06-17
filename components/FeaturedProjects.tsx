import { useState } from 'react';
import FeaturedProjectsItem from './featured-projects-item';
import getTextsMap from './get-texts-map';

export default function FeaturedProjects({ isFullStack }) {
  const [selectedComponent, setSelectedComponent] = useState(<FeaturedProjectsItem isFullStack={isFullStack} />);
  const [currentCategory, setCurrentCategory] = useState("websites");
  const categories = ["websites", "desktopApps", "mobileApps", "contributions", "static", "template"];

  const handleItemClick = (component, category) => {
    setSelectedComponent(component);
    setCurrentCategory(category);
  };

  const wwwNheekNo = {
    featuredProjects: "utvalgte prosjekter",
    websites: "Nettsteder",
    desktopApps: "Desktop Apper",
    mobileApps: "Mobile Apper",
    contributions: "Contributions",
    static: "Statisk",
    template: "Mal",
    new: "nytt"
  };
  const wwwDefault = {
    featuredProjects: "featured projects",
    websites: "Websites",
    desktopApps: "Desktop Apps",
    mobileApps: "Mobile Apps",
    contributions: "Contributions",
    static: "Static",
    template: "Template",
    new: "new"
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault
  };
  const textsMap = getTextsMap(domainPairs);

  // if there is a new project under a category, put the category here
  const newProjects = [];

  return (
    <section className="px-4 pt-[20%] md:pt-[10%]">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[6rem]">
        {textsMap.featuredProjects}
      </hgroup>
      <section className="mt-8 md:mt-14 md:ml-6">
        <ul className="flex flex-wrap gap-2">
          {categories.map(category => (
            <li
              key={category}
              className={`${currentCategory === category ? "bg-gray-400 text-blue-950" : ""} border border-1 border-gray-400 rounded-3xl hover:bg-gray-400 hover:text-blue-950 cursor-pointer`}
            >
              <button
                className="relative w-full h-full px-3 py-2"
                onClick={() => handleItemClick(<FeaturedProjectsItem isFullStack={isFullStack} category={category} />, category)}>
                {textsMap[category]}
                { newProjects && newProjects.includes(textsMap[category]) &&
                  <div className="absolute -top-2 md:-top-5 -right-3 bg-green-600 transform rotate-12 px-1 py-2 rounded-full text-xs">{ textsMap.new }</div>
                }
              </button>
            </li>
          ))}
        </ul>
      </section>
      {selectedComponent}
    </section>
  );
}
