import getTextsMap from "./GetTextsMap";

export default function Skills() {
  const wwwNheekNo = {
    txtSkills: "ferdigheter",
    txtCurrentlyLearning: "lærer for tiden",
  };

  const wwwDefault = {
    txtSkills: "skills",
    txtCurrentlyLearning: "currently learning",
  };

  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };

  let textsMap = getTextsMap(domainPairs);

  let skills = [
    "CSS",
    "CloudFlare",
    "Firebase",
    "Docker",
    "Docker Compose",
    "TailwindCSS",
    "TypeScript",
    "ExpressJS",
    "GitHub",
    "GitHub Actions",
    "WordPress",
    "HTML",
    "Java",
    "JavaScript",
    "jQuery",
    "MySQL",
    "NextJS",
    "NodeJS",
    "PHP",
    "Python",
    "PyQT",
    "ReactJS",
    "RemixJS",
    "RESTful API",
    "Socket.IO",
    "React Native",
    "Expo Go",
    "PostgreSQL",
    "Vite",
    "JUnit",
    "Docker Hub",
    "AstroJS",
    "Zola",
    "nginx",
  ];
  let middleSkills = [
    "Django",
    "Git",
    "Flutter",
    "JPA",
    "C#",
    "JWT",
    "Kubernetes",
  ];
  let orangeSkills = ["SCSS", "Swift", "Go", "C++", "SQLite"];
  let upcomingSkills = ["Vue.js", "Spring Boot", "Angular", ".NET", "Blazor"];
  skills.sort((a, b) => a.localeCompare(b));
  middleSkills.sort((a, b) => a.localeCompare(b));
  orangeSkills.sort((a, b) => a.localeCompare(b));
  upcomingSkills.sort((a, b) => a.localeCompare(b));

  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[6rem]">
        {textsMap.txtSkills}
      </hgroup>
      <div className="w-max bg-[#1C2951] brightness-125 hover:brightness-[unset] mt-6 ml-4 md:ml-[3.25rem] px-3 py-1 rounded-3xl duration-500">
        {textsMap.txtCurrentlyLearning}
      </div>
      <div className="text-md w-[90%] mt-8 md:mt-10 m-auto">
        <ul className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <li
              key={"skills" + index}
              className="bg-green-600 bg-opacity-50 px-3 py-1 rounded-3xl hover:scale-105 hover:mx-3 duration-200"
            >
              {skill}
            </li>
          ))}
          {middleSkills.map((skill, index) => (
            <li
              key={"middleSkills" + index}
              className="bg-gradient-to-br from-green-600/50 to-yellow-600/50 px-3 py-1 rounded-3xl hover:scale-105 hover:mx-3 duration-200"
            >
              {skill}
            </li>
          ))}
          {orangeSkills.map((skill, index) => (
            <li
              key={"orangeSkills" + index}
              className="bg-yellow-600 bg-opacity-50 px-3 py-1 rounded-3xl hover:scale-105 hover:mx-3 duration-200"
            >
              {skill}
            </li>
          ))}
          {upcomingSkills.map((skill, index) => (
            <li
              key={"upcomingSkills" + index}
              className="bg-[#1C2951] brightness-125 px-3 py-1 rounded-3xl hover:scale-105 hover:mx-3 duration-200"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
