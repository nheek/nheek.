import { useEffect, useState, useRef } from 'react';
import getTextsMap from '../components/get-texts-map';
import FeaturedProjectsItemItem from './featured-projects-item-item';

export default function FeaturedProjectsItem({ category = "websites" }) {
  const [projectsToShow, setProjectsToShow] = useState([])
  const [txtInfo, setTxtInfo] = useState({})
  const projects = {
    websites: [
      { name: 'nheek', desc: 'this portfolio website', link: 'https://www.nheek.com/', image: '/featured-projects/nheek.png', mobileImage: '/featured-projects/mobile/m-nheek.png', techstack: ['NextJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'], onGithub: "https://github.com/nheek/nheek." },
      { name: 'raincheck', desc: 'weather web app', link: 'https://raincheck.nheek.com/', image: '/featured-projects/raincheck.png', mobileImage: '/featured-projects/mobile/m-raincheck.png', techstack: ['Django', 'Python', 'JavaScript', 'TailwindCSS'] },
      { name: 'wee', desc: 'link shortening platform', link: 'https://wee.nheek.com/', image: '/featured-projects/wee.png', mobileImage: '/featured-projects/mobile/m-wee.png', techstack: ['NextJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'] },
      { name: 'shareme', desc: 'no-login todo list web app', link: 'https://shareme.nheek.com/', image: '/featured-projects/shareme.png', mobileImage: '/featured-projects/mobile/m-shareme.png', techstack: ['PHP', 'MySQL', 'TailwindCSS'], onGithub: "https://github.com/nheek/shareme" },
      { name: 'notasrare', desc: 'public poll platform', link: 'https://notasrare.nheek.com/', image: '/featured-projects/notasrare.png', mobileImage: '/featured-projects/mobile/m-notasrare.png', techstack: ['NextJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'] },
      { name: 'motto', desc: 'virtual friend app', link: 'https://motto.nheek.com/', image: '/featured-projects/motto.png', mobileImage: '/featured-projects/mobile/m-motto.png', techstack: ['NextJS', 'NodeJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/motto" },
      { name: 'lookatme', desc: 'real-time statistics entertainment platform', link: 'https://lookatme.nheek.com/', image: '/featured-projects/lookatme.png', mobileImage: '/featured-projects/mobile/m-lookatme.png', techstack: ['ExpressJS', 'MySQL', 'TailwindCSS', 'Socket.IO'] },
      { name: 'bould', desc: 'cover photo focused blog platform', link: 'https://bould.nheek.com/', image: '/featured-projects/bould.png', mobileImage: '/featured-projects/mobile/m-bould.png', techstack: ['AstroJS', 'NodeJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/bould" },
      { name: 'kledeli', desc: 'children clothing subscription platform', link: 'https://kledeli.nheek.com/', image: '/featured-projects/kledeli.png', mobileImage: '/featured-projects/mobile/m-kledeli.png', techstack: ['PHP', 'MySQL', 'TailwindCSS'] },
      { name: 'swiftgoss', desc: 'anonymous social media platform', link: 'https://swiftgoss.nheek.com/', image: '/featured-projects/swiftgoss.png', mobileImage: '/featured-projects/mobile/m-swiftgoss.png', techstack: ['PHP', 'MySQL'] },
      { name: 'studently', desc: 'schools forum platform', link: 'https://studently.nheek.com/', image: '/featured-projects/studently.png', mobileImage: '/featured-projects/mobile/m-studently.png', techstack: ['PHP', 'MySQL'] },
      { name: 'poetree', desc: 'google-inspired poetry library', link: 'https://poetree.nheek.com/', image: '/featured-projects/poetree.png', techstack: ['PHP', 'MySQL'] },
    ],
    apps: [
      { name: 'simple calculator', desc: 'simple calculator application', link: 'https://python.nheek.com/codes/simple_calculator?from_nheek=true', image: '/featured-projects/python/simple_calculator.png', techstack: ['Python', 'PyQt6'] },
      { name: 'weather', desc: 'minimalistic weather application', link: 'https://python.nheek.com/codes/weather?from_nheek=true', image: '/featured-projects/python/weather.png', techstack: ['Python', 'PyQt6'] },
      { name: 'password generator', desc: 'secure password generator application', link: '#', image: '/featured-projects/python/password_generator.png', techstack: ['Python', 'PyQt6'] },
    ],
    contributions: [
      { name: '<pin/>', desc: 'landing page for <pin/>', link: 'https://pin.nheek.com/', image: '/featured-projects/pin.png', mobileImage: '/featured-projects/mobile/m-pin.png', techstack: ['NextJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/PIN", collaborators: [{name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal"}] },
      { name: 'fribyte', desc: 'landing page for fribyte', link: 'https://fribyte.no/', image: '/featured-projects/fribyte.png', mobileImage: '/featured-projects/mobile/m-fribyte.png', techstack: ['Zola', 'SCSS'], onGithub: "https://github.com/fribyte-code/fribyte.no" },
    ],
    static: [
      { name: 'lady', desc: 'food service online platform', link: 'https://lady.nheek.com/', image: '/featured-projects/static/lady.png', techstack: ['NextJS', 'TypeScript', 'TailwindCSS'] },
      { name: 'techie', desc: 'tech product landing page', link: 'https://techie.nheek.com/', image: '/featured-projects/static/techie.png', techstack: ['NextJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/techie" },
    ],
    template: [
      { name: 'hexrovk', desc: 'social media platform', link: 'https://hexrovk.nheek.com/', image: '/featured-projects/template/hexrovk.png', techstack: ['PHP', 'JQuery'] },
      { name: 'yloizah', desc: 'executive virtual assistant portfolio', link: 'https://yloizah.nheek.com/', image: '/featured-projects/yloizah.png', techstack: ['NextJS', 'Bootstrap'] },
    ],
  };
  const projects_no = {
    websites: [
      { name: 'nheek', desc: 'denne portefølje nettsiden', link: 'https://www.nheek.no/', image: '/featured-projects/nheek-no.png', mobileImage: '/featured-projects/mobile/m-nheek.png', techstack: ['NextJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'], onGithub: "https://github.com/nheek/nheek." },
      { name: 'raincheck', desc: 'vær web app', link: 'https://raincheck.nheek.com/', image: '/featured-projects/raincheck.png', mobileImage: '/featured-projects/mobile/m-raincheck.png', techstack: ['Django', 'Python', 'JavaScript', 'TailwindCSS'] },
      { name: 'wee', desc: 'lenkeforkortingsplattform', link: 'https://wee.nheek.com/', image: '/featured-projects/wee.png', mobileImage: '/featured-projects/mobile/m-wee.png', techstack: ['NextJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'] },
      { name: 'shareme', desc: 'no-login todo list web app', link: 'https://shareme.nheek.com/', image: '/featured-projects/shareme.png', mobileImage: '/featured-projects/mobile/m-shareme.png', techstack: ['PHP', 'MySQL', 'TailwindCSS'],  onGithub: "https://github.com/nheek/shareme" },
      { name: 'notasrare', desc: 'offentlig avstemningsplattform', link: 'https://notasrare.nheek.com/', image: '/featured-projects/notasrare.png', mobileImage: '/featured-projects/mobile/m-notasrare.png', techstack: ['NextJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'] },
      { name: 'motto', desc: 'virtuell venn app', link: 'https://motto.nheek.com/', image: '/featured-projects/motto.png', mobileImage: '/featured-projects/mobile/m-motto.png', techstack: ['NextJS', 'NodeJS', 'TypeScript', 'Tailwind'], onGithub: "https://github.com/nheek/motto" },
      { name: 'lookatme', desc: 'real-time statistikk underholdningsplattform', link: 'https://lookatme.nheek.com/', image: '/featured-projects/lookatme.png', mobileImage: '/featured-projects/mobile/m-lookatme.png', techstack: ['ExpressJS', 'MySQL', 'TailwindCSS', 'Socket.IO'] },
      { name: 'bould', desc: 'forsidebildefokusert bloggplattform', link: 'https://bould.nheek.com/', image: '/featured-projects/bould.png', mobileImage: '/featured-projects/mobile/m-bould.png', techstack: ['AstroJS', 'NodeJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/bould" },
      { name: 'kledeli', desc: 'abonnementsplattform for barneklær', link: 'https://kledeli.nheek.com/', image: '/featured-projects/kledeli.png', mobileImage: '/featured-projects/mobile/m-kledeli.png', techstack: ['PHP', 'MySQL', 'TailwindCSS'] },
      { name: 'swiftgoss', desc: 'anonym sosiale medie', link: 'https://swiftgoss.nheek.com/', image: '/featured-projects/swiftgoss.png', mobileImage: '/featured-projects/mobile/m-swiftgoss.png', techstack: ['PHP', 'MySQL'] },
      { name: 'studently', desc: 'skolens forumplattform', link: 'https://studently.nheek.com/', image: '/featured-projects/studently.png', mobileImage: '/featured-projects/mobile/m-studently.png', techstack: ['PHP', 'MySQL'] },
      { name: 'poetree', desc: 'google-inspirert poesibibliotek', link: 'https://poetree.nheek.com/', image: '/featured-projects/poetree.png', techstack: ['PHP', 'MySQL'] },
    ],
    apps: [
      { name: 'enkel kalkulator', desc: 'enkel kalkulator applikasjon', link: 'https://python.nheek.com/codes/simple_calculator?from_nheek=true', image: '/featured-projects/python/simple_calculator.png', techstack: ['Python', 'PyQt6'] },
      { name: 'vær', desc: 'minimalistisk vær applikasjon', link: 'https://python.nheek.com/codes/weather?from_nheek=true', image: '/featured-projects/python/weather.png', techstack: ['Python', 'PyQt6'] },
      { name: 'passordgenerering', desc: 'sikker passordgenerering applikasjon', link: '#', image: '/featured-projects/python/password_generator.png', techstack: ['Python', 'PyQt6'] },
    ],
    contributions: [
      { name: '<pin/>', desc: 'landingsside for <pin/>', link: 'https://pin.nheek.com/', image: '/featured-projects/pin.png', mobileImage: '/featured-projects/mobile/m-pin.png', techstack: ['NextJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/PIN", collaborators: [{name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal"}] },
      { name: 'fribyte', desc: 'landingsside for fribyte', link: 'https://fribyte.no/', image: '/featured-projects/fribyte.png', mobileImage: '/featured-projects/mobile/m-fribyte.png', techstack: ['Zola', 'SCSS'], onGithub: "https://github.com/fribyte-code/fribyte.no" },
    ],
    static: [
      { name: 'lady', desc: 'nettbasert matserveringstjeneste', link: 'https://lady.nheek.com/', image: '/featured-projects/static/lady.png', techstack: ['NextJS', 'TypeScript', 'TailwindCSS'] },
      { name: 'techie', desc: 'landingsside for tech-produkter', link: 'https://techie.nheek.com/', image: '/featured-projects/static/techie.png', techstack: ['NextJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/techie" },
    ],
    template: [
      { name: 'hexrovk', desc: 'sosial medieplattform', link: 'https://hexrovk.nheek.com/', image: '/featured-projects/template/hexrovk.png', techstack: ['PHP', 'JQuery'] },
      { name: 'yloizah', desc: 'portefølje for virtuell lederassistent', link: 'https://yloizah.nheek.com/', image: '/featured-projects/yloizah.png', techstack: ['NextJS', 'Bootstrap'] },
    ],
  };
  const wwwNheekNo = {
    projectsToShowMap: projects_no,
    contributions: "disse er prosjekter jeg har bidratt til",
    static: "disse er ikke funksjonelle nettsteder/apper",
    template: "disse er nettsteder/apper jeg delvis har kodet",
    with: "med"
  };
  const wwwDefault = {
    projectsToShowMap: projects,
    contributions: "these are projects i have contributed to",
    static: "these are non-functional websites/applications",
    template: "these are websites/apps i partially coded",
    with: "with"
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  };
  const textsMap = getTextsMap(domainPairs);
  const sectionRef = useRef(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setProjectsToShow(textsMap.projectsToShowMap[category].slice(startIndex, endIndex));
    setTxtInfo(textsMap);

    
  }, [category, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const totalPages = Math.ceil(textsMap.projectsToShowMap[category].length / itemsPerPage);
  useEffect(() => {
    if (currentPage > 1 && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <section ref={sectionRef} className="relative text-3xl leading-snug flex flex-col md:flex-row items-center justify-center gap-[7%] flex-wrap">
          <span className="text-lg -mb-8 md:mb-0 mt-4 md:absolute top-0 italic opacity-60">
          {txtInfo[category] || ""}
        </span>
        {projectsToShow.map((project, index) => (
          <FeaturedProjectsItemItem key={index} project={project} txtInfo={txtInfo} />
        ))}
      </section>
      {totalPages > 1 && (
        <div className="flex gap-4 justify-center mt-12">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`h-8 w-8 hover:bg-white hover:text-blue-950 border-2 border-solid border-opacity-50 rounded-full ${
                currentPage === index + 1 ? "bg-white text-blue-950" : ""
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