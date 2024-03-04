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
    "CSS", "CloudFlare", "Django", "Zola", "Firebase",
    "Docker", "Docker Compose", "TailwindCSS", "TypeScript", 
    "ExpressJS", "GitHub", "GitHub Actions", "WordPress",
    "HTML", "Java", "JavaScript", "jQuery", "MySQL", "NextJS",
    "NGINX", "NodeJS", "PHP", "Python", "PyQT",
    "ReactJS", "RemixJS", "RESTful API", "Socket.IO"
  ];
  let orangeSkills = [
    "AstroJS", "SCSS", "Swift", "Flutter", "Git", "Go", "C++"
  ]
  skills.sort();
  orangeSkills.sort();

  return (
    <div className="px-4 pt-[25%] md:pt-[15%] min-h-max">
        <section className="text-6xl md:text-[6rem] xl:text-[10rem]">
          {textsMap.txtSkills}
        </section>
        <section className="text-md w-[90%] mt-4 m-auto">
          <ul className="flex flex-wrap gap-3">
            {
              skills.map((skill, index) => (
                <li key={index} className="bg-green-600 px-3 py-1 rounded-3xl duration-500">{skill}</li>
              ))
            }
            {
              orangeSkills.map((skill, index) => (
                <li key={index} className="bg-yellow-600 px-3 py-1 rounded-3xl duration-500">{skill}</li>
              ))
            }
          </ul>
        </section>
    </div>
  );
}