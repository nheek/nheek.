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
    "CSS", "CloudFlare", "Firebase",
    "Docker", "Docker Compose", "TailwindCSS", "TypeScript", 
    "ExpressJS", "GitHub", "GitHub Actions", "WordPress",
    "HTML", "Java", "JavaScript", "jQuery", "MySQL", "NextJS",
    "NGINX", "NodeJS", "PHP", "Python", "PyQT",
    "ReactJS", "RemixJS", "RESTful API", "Socket.IO"
  ];
  let middleSkills = [
    "Zola", "Django", "AstroJS", "Git", "Flutter"
  ]
  let orangeSkills = [
    "SCSS", "Swift", "Go", "C++", "C#"
  ]
  skills.sort();
  middleSkills.sort();
  orangeSkills.sort();

  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
        <hgroup className="text-4xl md:text-[4rem] xl:text-[6rem]">
          {textsMap.txtSkills}
        </hgroup>
        <div className="text-md w-[90%] mt-4 md:mt-10 m-auto">
          <ul className="flex flex-wrap gap-3">
            {
              skills.map((skill, index) => (
                <li key={index} className="bg-green-600 bg-opacity-50 px-3 py-1 rounded-3xl duration-500">{skill}</li>
              ))
            }
            {
              middleSkills.map((skill, index) => (
                <li key={index} className="bg-gradient-to-br from-green-600/50 to-yellow-600/50 px-3 py-1 rounded-3xl duration-500">{skill}</li>
              ))
            }
            {
              orangeSkills.map((skill, index) => (
                <li key={index} className="bg-yellow-600 bg-opacity-50 px-3 py-1 rounded-3xl duration-500">{skill}</li>
              ))
            }
          </ul>
        </div>
    </section>
  );
}