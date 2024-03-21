import { useState } from 'react';
import FeaturedProjectsItem from '../components/featured-projects-item';
import getTextsMap from '../components/get-texts-map';

export default function FeaturedProjects({isFullStack}) {
  const [selectedComponent, setSelectedComponent] = useState(<FeaturedProjectsItem isFullStack={isFullStack} />);
  const [currentCategory, setCurrentCategory] = useState("websites");
  const categories = ["websites", "apps", "contributions", "static", "template"];

  const handleItemClick = (component, category) => {
    setSelectedComponent(component);
    setCurrentCategory(category);
  };

  const wwwNheekNo = {
    featuredProjects: "utvalgte prosjekter",
    websites: "Nettsteder",
    apps: "Apper",
    contributions: "Contributions",
    static: "Statisk",
    template: "Mal"
  };
  const wwwDefault = {
    featuredProjects: "featured projects",
    websites: "Websites",
    apps: "Apps",
    contributions: "Contributions",
    static: "Static",
    template: "Template"
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  };
  const textsMap = getTextsMap(domainPairs);

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
              className={`${currentCategory === category ? "bg-gray-400 text-blue-950" : ""} border border-1 border-gray-400 px-3 py-2 rounded-3xl hover:bg-gray-400 hover:text-blue-950 cursor-pointer`}
              onClick={() => handleItemClick(<FeaturedProjectsItem isFullStack={isFullStack} category={category} />, category)}
            >
              {textsMap[category]}
            </li>
          ))}
        </ul>
      </section>
      {selectedComponent}
    </section>
  );
}
