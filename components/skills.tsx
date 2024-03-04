import getTextsMap from '../components/get-texts-map';

export default function Skills() {
  const wwwNheekNo = {
    txtSkills: 'ferdigheter',
  };
  
  const wwwDefault = {
    txtSkills: 'skills',
  };
  
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  }

  let textsMap = getTextsMap(domainPairs);

  let skills = [
    "AstroJS",
    "CSS", "CloudFlare", "Django",
    "Docker", "Docker Compose",
    "ExpressJS", "Git", "GitHub", "GitHub Actions",
    "HTML", "Java", "JavaScript", "jQuery", "MySQL",
    "NextJS",
    "NGINX", "NodeJS", "PHP", "Python", "PyQt",
    "ReactJS", "RemixJS", "REST API", "SCSS", "Socket.IO",
    "TailwindCSS", "TypeScript", "WordPress",
    "Zola"
  ];

  return (
    <div className="px-4 pt-[25%] md:pt-[15%] min-h-max">
        <section className="text-6xl md:text-[6rem] xl:text-[10rem]">
          {textsMap.txtSkills}
        </section>
        <section className="text-md w-[90%] mt-4 m-auto">
          <ul className="flex flex-wrap gap-3">
            {
              skills.map((skill, index) => (
                <li key={index} className="hover:bg-gray-200 hover:text-blue-950 px-3 py-1 border-2 border-gray-200 rounded-3xl duration-500">{skill}</li>
              ))
            }
          </ul>
        </section>
    </div>
  );
}