import { useEffect, useState, useRef } from 'react';
import GetTextsMap from './GetTextsMap';
import FeaturedProjectsItemItem from './FeaturedProjectsItemItem';

export default function FeaturedProjectsItem({
  category = "websites"
}: FeaturedProjectsItemProps) {
  const [projectsToShow, setProjectsToShow] = useState([])
  const [txtInfo, setTxtInfo] = useState({})
  const projects = {
    websites: [
      { name: 'nheek', desc: 'this portfolio website', link: 'https://www.nheek.com/', image: '/featured-projects/nheek.png', mobileImage: '/featured-projects/mobile/m-nheek.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'], onGithub: "https://github.com/nheek/nheek.", deployedWith: ["docker", "github actions"] },
      { name: 'raincheck', desc: 'weather web app', link: 'https://raincheck.nheek.com/', image: '/featured-projects/raincheck.png', mobileImage: '/featured-projects/mobile/m-raincheck.png', techstack: ['Django', 'Python', 'JavaScript', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'wee', desc: 'link shortening platform', link: 'https://wee.nheek.com/', image: '/featured-projects/wee.png', mobileImage: '/featured-projects/mobile/m-wee.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'PostgreSQL', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'shareme', desc: 'no-login todo list web app', link: 'https://shareme.nheek.com/', image: '/featured-projects/shareme.png', mobileImage: '/featured-projects/mobile/m-shareme.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL', 'TailwindCSS'], onGithub: "https://github.com/nheek/shareme", deployedWith: ["docker", "github actions"] },
      { name: 'spring', dateAdded: '12.04.2024', status: "under construction", desc: 'job portal platform', link: 'https://spring.nheek.com/', image: '/featured-projects/spring.png', techstack: ['Angular', 'TypeScript', 'Spring Boot', 'Maven', 'PostgreSQL', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'notasrare', desc: 'public poll platform', link: 'https://notasrare.nheek.com/', image: '/featured-projects/notasrare.png', mobileImage: '/featured-projects/mobile/m-notasrare.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'motto', desc: 'virtual friend app', link: 'https://motto.nheek.com/', image: '/featured-projects/motto.png', mobileImage: '/featured-projects/mobile/m-motto.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/motto", deployedWith: ["docker", "github actions"] },
      { name: 'lookatme', desc: 'real-time statistics entertainment platform', link: 'https://lookatme.nheek.com/', image: '/featured-projects/lookatme.png', mobileImage: '/featured-projects/mobile/m-lookatme.png', techstack: ['ExpressJS', 'MySQL', 'TailwindCSS', 'Socket.IO'], deployedWith: ["docker", "github actions"] },
      { name: 'swiftgoss', desc: 'anonymous social media platform', link: 'https://swiftgoss.nheek.com/', image: '/featured-projects/swiftgoss.png', mobileImage: '/featured-projects/mobile/m-swiftgoss.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL'], deployedWith: ["docker", "github actions"] },
      { name: 'studently', desc: 'schools forum platform', link: 'https://studently.nheek.com/', image: '/featured-projects/studently.png', mobileImage: '/featured-projects/mobile/m-studently.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL'], deployedWith: ["docker", "github actions"] },
      { name: 'confy', desc: 'anonymous confession site', link: 'https://confy.nheek.com/', image: '/featured-projects/confy.png', techstack: ['RemixJS', 'ReactJS', 'NodeJS', 'TypeScript', 'PostgreSQL', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'poetree', desc: 'google-inspired poetry library', link: 'https://poetree.nheek.com/', image: '/featured-projects/poetree.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL'], deployedWith: ["docker", "github actions"] },
      { name: 'malky', desc: 'intelligent virtual ai assistant', link: 'https://malky.nheek.com/', image: '/featured-projects/malky.png',  mobileImage: '/featured-projects/mobile/m-malky.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'free', dateAdded: '14.04.2024', desc: 'anonymous freedom wall', link: 'https://free.nheek.com/', image: '/featured-projects/free.png',  mobileImage: '/featured-projects/mobile/m-free.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'recreate', dateAdded: '23.07.2024', status: "early access", desc: '90\'s webpage builder', link: 'https://recreate.nheek.com/', image: '/featured-projects/recreate.png',  mobileImage: '/featured-projects/mobile/m-recreate.png', techstack: ['HTML', 'JavaScript', 'REST API'], deployedWith: ["docker", "github actions"] },
    ],
    desktopApps: [
      { name: 'simple calculator', desc: 'simple calculator application', link: 'https://python.nheek.com/codes/simple_calculator?from_nheek=true', image: '/featured-projects/desktop-apps/simple_calculator.png', techstack: ['Python', 'PyQt6'] },
      { name: 'weather', desc: 'minimalistic weather application', link: 'https://python.nheek.com/codes/weather?from_nheek=true', image: '/featured-projects/desktop-apps/weather.png', techstack: ['Python', 'PyQt6'] },
      { name: 'password generator', desc: 'secure password generator application', link: '#', image: '/featured-projects/desktop-apps/password_generator.png', techstack: ['Python', 'PyQt6'] },
    ],
    mobileApps: [
      { name: 'filebox (static)', desc: 'file explorer/manager', image: ['/featured-projects/mobile-apps/filebox.png'], techstack: ['React Native', 'ReactJS'] },
      { name: 'vereefy (static)', desc: 'simple id verification', image: ['/featured-projects/mobile-apps/vereefy/vereefy-login.png', '/featured-projects/mobile-apps/vereefy/vereefy-id.png', '/featured-projects/mobile-apps/vereefy/vereefy-option-prompt.png'], techstack: ['React Native', 'ReactJS'] },
    ],
    contributions: [
      { name: '<pin/>', desc: 'landing page for <pin/>', link: 'https://pin.rootlinjeforening.no/', image: '/featured-projects/contributions/pin.png', mobileImage: '/featured-projects/mobile/contributions/m-pin.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/Project-insert-name/PIN", collaborators: [{name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal"}] },
      { name: 'fribyte', desc: 'landing page for fribyte', link: 'https://fribyte.no/', image: '/featured-projects/contributions/fribyte.png', mobileImage: '/featured-projects/mobile/contributions/m-fribyte.png', techstack: ['Zola', 'SCSS'], onGithub: "https://github.com/fribyte-code/fribyte.no" },
      { name: 'fribyte ctf', desc: 'fribyte\'s own capture the flag platform', link: 'https://ctf.fribyte.no/', image: '/featured-projects/contributions/fribyte-ctf.png', mobileImage: '/featured-projects/mobile/contributions/m-fribyte-ctf.png', techstack: ['ViteJS', 'ReactJS', 'TypeScript', '.NET', 'CSS'], onGithub: "https://github.com/fribyte-code/friByte.capture-the-flag" },
      { name: 'boskonf', dateAdded: '02.08.2024', desc: 'bergen open source conference', link: 'https://boskonf.no/', image: '/featured-projects/contributions/boskonf.png', mobileImage: '/featured-projects/mobile/contributions/m-boskonf.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'CSS'], onGithub: "https://github.com/fribyte-code/boskonf.no" },
      { name: 'fribyte wiki', desc: 'fribyte\'s internal wiki', link: 'https://wiki.fribyte.no/', image: '/featured-projects/contributions/fribyte-wiki.png', mobileImage: '/featured-projects/mobile/contributions/m-fribyte-wiki.png', techstack: ['Zola', 'SCSS'], onGithub: "https://github.com/fribyte-code/wiki" },
      { name: 'root', desc: 'computer and it student organisation in hvl bergen', link: 'https://www.rootlinjeforening.no/', image: '/featured-projects/contributions/root.png', mobileImage: '/featured-projects/mobile/contributions/m-root.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS', 'Sanity'], onGithub: "https://github.com/Project-insert-name/root-website" },
      { name: 'kledeli', desc: 'children clothing subscription platform', link: 'https://kledeli.nheek.com/', image: '/featured-projects/contributions/kledeli.png', mobileImage: '/featured-projects/mobile/contributions/m-kledeli.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL', 'TailwindCSS'], collaborators: [{name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal"}], deployedWith: ["docker", "github actions"] },
      { name: 'sipscore', dateAdded: '22.09.24', desc: 'alcohol consumption tracker', link: 'https://sipscore.patreek.no/', image: '/featured-projects/contributions/sipscore.png', mobileImage: '/featured-projects/mobile/contributions/m-sipscore.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'PostgreSQL', 'TailwindCSS'], collaborators: [{name: "Patrik Thormodsen", link: "https://github.com/pthormodsen"}], deployedWith: ["docker", "github actions"] },
      { name: 'homing', status: 'under construction', desc: 'social media messaging web app', link: 'https://homing.lukasry.no/', image: '/featured-projects/contributions/homing.png', techstack: ['PHP', 'JavaScript', 'MySQL', 'JQuery', 'CSS'], collaborators: [{name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal"}], deployedWith: ["docker", "github actions"] },
      { name: 'kvarteret', dateAdded: '13.04.2024', status: 'under construction', desc: 'student culture center', link: 'https://kvarteret.no/', image: '/featured-projects/contributions/kvarteret.png', mobileImage: '/featured-projects/mobile/contributions/m-kvarteret.png', techstack: ['AstroJS', 'ReactJS', 'GraphQL', 'Directus', 'CSS'] },
      { name: 'bergen light rail quiz', dateAdded: '19.06.2024', desc: 'quiz game based on bergen\'s light rail', link: 'https://bybane-quiz.nheek.com/', image: '/featured-projects/contributions/bybane-quiz.png', mobileImage: '/featured-projects/mobile/contributions/m-bybane-quiz.png', techstack: ['AstroJS', 'NodeJS', 'CSS'], collaborators: [{name: "Aggi", link: "https://github.com/aggicreative555"}, {name: "Ole Martin Amundsen", link: "https://github.com/671454"}], deployedWith: ["docker", "github actions"] },
    ],
    static: [
      { name: 'lady', desc: 'food service online platform', link: 'https://lady.nheek.com/', image: '/featured-projects/static/lady.png', mobileImage: '/featured-projects/mobile/static/m-lady.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'techie', desc: 'tech product landing page', link: 'https://techie.nheek.com/', image: '/featured-projects/static/techie.png', mobileImage: '/featured-projects/mobile/static/m-techie.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/techie", deployedWith: ["docker", "github actions"] },
      { name: 'arch', desc: 'interior design landing page', link: 'https://arch.nheek.com/', image: '/featured-projects/static/arch.png', techstack: ['ReactJS', 'ViteJS', 'TypeScript', 'CSS'], deployedWith: ["docker", "github actions"] },
      { name: 'bould', desc: 'cover photo focused blog platform', link: 'https://bould.nheek.com/', image: '/featured-projects/bould.png', mobileImage: '/featured-projects/mobile/m-bould.png', techstack: ['AstroJS', 'NodeJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/bould", deployedWith: ["docker", "github actions"] },
      { name: 'kinder', dateAdded: '03.08.2024', desc: 'children kindergarten', link: 'https://kinder.nheek.com/', image: '/featured-projects/static/kinder.png', techstack: ['SvelteKit', 'TypeScript', 'CSS'], deployedWith: ["docker", "github actions"] },
      { name: 'ingo', dateAdded: '23.07.2024', desc: 'overseas travel tracker', link: 'https://ingo.nheek.com/', image: '/featured-projects/static/ingo.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'truhvel', dateAdded: '09.04.2024', desc: 'underwater exploration landing page', link: 'https://truhvel.nheek.com/', image: '/featured-projects/static/truhvel.png', techstack: ['VueJS', 'ViteJS', 'TypeScript', 'CSS'], deployedWith: ["docker", "github actions"] },
    ],
    template: [
      { name: 'hexrovk', status: 'maintenance', desc: 'social media platform', link: 'https://hexrovk.nheek.com/', image: '/featured-projects/template/hexrovk.png', mobileImage: '/featured-projects/mobile/template/m-hexrovk.png', techstack: ['PHP', 'JavaScript', 'MySQL', 'JQuery', 'CSS'] },
      { name: 'yloizah', desc: 'executive virtual assistant portfolio', link: 'https://yloizah.nheek.com/', image: '/featured-projects/template/yloizah.png', mobileImage: '/featured-projects/mobile/template/m-yloizah.png', techstack: ['NextJS', 'ReactJS', 'Bootstrap', 'SCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'wine', dateAdded: '02.08.2024', desc: 'fashion blog', link: 'https://wine.nheek.com/', image: '/featured-projects/template/wine.png', techstack: ['WordPress', 'PHP', 'JavaScript', 'CSS'], deployedWith: ["docker", "github actions"] },
      { name: 'grownoo', status: 'maintenance', desc: 'video production agency landing page', link: 'https://grownoo.nheek.com/', image: '/featured-projects/template/grownoo.png', mobileImage: '/featured-projects/mobile/template/m-grownoo.png', techstack: ['WordPress', 'PHP', 'JavaScript', 'CSS'] },
    ],
  };
  const projects_no = {
    websites: [
      { name: 'nheek', desc: 'denne portefølje nettsiden', link: 'https://www.nheek.no/', image: '/featured-projects/nheek-no.png', mobileImage: '/featured-projects/mobile/m-nheek.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'], onGithub: "https://github.com/nheek/nheek.", deployedWith: ["docker", "github actions"] },
      { name: 'raincheck', desc: 'vær web app', link: 'https://raincheck.nheek.com/', image: '/featured-projects/raincheck.png', mobileImage: '/featured-projects/mobile/m-raincheck.png', techstack: ['Django', 'Python', 'JavaScript', 'TailwindCSS'] },
      { name: 'wee', desc: 'lenkeforkortingsplattform', link: 'https://wee.nheek.com/', image: '/featured-projects/wee.png', mobileImage: '/featured-projects/mobile/m-wee.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'PostgreSQL', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'shareme', desc: 'no-login todo list web app', link: 'https://shareme.nheek.com/', image: '/featured-projects/shareme.png', mobileImage: '/featured-projects/mobile/m-shareme.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL', 'TailwindCSS'],  onGithub: "https://github.com/nheek/shareme" },
      { name: 'spring', dateAdded: '12.04.2024', status: "under arbeid", desc: 'jobbportalplattform', link: 'https://spring.nheek.com/', image: '/featured-projects/spring.png', techstack: ['Angular', 'TypeScript', 'Spring Boot', 'Maven', 'PostgreSQL', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'notasrare', desc: 'offentlig avstemningsplattform', link: 'https://notasrare.nheek.com/', image: '/featured-projects/notasrare.png', mobileImage: '/featured-projects/mobile/m-notasrare.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'] },
      { name: 'motto', desc: 'virtuell venn app', link: 'https://motto.nheek.com/', image: '/featured-projects/motto.png', mobileImage: '/featured-projects/mobile/m-motto.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/motto" },
      { name: 'lookatme', desc: 'real-time statistikk underholdningsplattform', link: 'https://lookatme.nheek.com/', image: '/featured-projects/lookatme.png', mobileImage: '/featured-projects/mobile/m-lookatme.png', techstack: ['ExpressJS', 'MySQL', 'TailwindCSS', 'Socket.IO'] },
      { name: 'swiftgoss', desc: 'anonym sosiale medie', link: 'https://swiftgoss.nheek.com/', image: '/featured-projects/swiftgoss.png', mobileImage: '/featured-projects/mobile/m-swiftgoss.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL'] },
      { name: 'studently', desc: 'skolens forumplattform', link: 'https://studently.nheek.com/', image: '/featured-projects/studently.png', mobileImage: '/featured-projects/mobile/m-studently.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL'] },
      { name: 'confy', desc: 'anonym confession side', link: 'https://confy.nheek.com/', image: '/featured-projects/confy.png', techstack: ['RemixJS', 'ReactJS', 'NodeJS', 'TypeScript', 'PostgreSQL', 'TailwindCSS'] },
      { name: 'poetree', desc: 'google-inspirert poesibibliotek', link: 'https://poetree.nheek.com/', image: '/featured-projects/poetree.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL'] },
      { name: 'malky', desc: 'intelligent virtuell ki-assistant', link: 'https://malky.nheek.com/', image: '/featured-projects/malky.png',  mobileImage: '/featured-projects/mobile/m-malky.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'TailwindCSS'] },
      { name: 'free', dateAdded: '14.04.2024', desc: 'anonymt freedom wall', link: 'https://free.nheek.com/', image: '/featured-projects/free.png',  mobileImage: '/featured-projects/mobile/m-free.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'MySQL', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'recreate', dateAdded: '23.07.2024', status: "early access", desc: '90-talls nettsidebygger', link: 'https://recreate.nheek.com/', image: '/featured-projects/recreate.png',  mobileImage: '/featured-projects/mobile/m-recreate.png', techstack: ['HTML', 'JavaScript', 'REST API'], deployedWith: ["docker", "github actions"] },
    ],
    desktopApps: [
      { name: 'enkel kalkulator', desc: 'enkel kalkulator applikasjon', link: 'https://python.nheek.com/codes/simple_calculator?from_nheek=true', image: '/featured-projects/desktop-apps/simple_calculator.png', techstack: ['Python', 'PyQt6'] },
      { name: 'vær', desc: 'minimalistisk vær applikasjon', link: 'https://python.nheek.com/codes/weather?from_nheek=true', image: '/featured-projects/desktop-apps/weather.png', techstack: ['Python', 'PyQt6'] },
      { name: 'passordgenerering', desc: 'sikker passordgenerering applikasjon', link: '#', image: '/featured-projects/desktop-apps/password_generator.png', techstack: ['Python', 'PyQt6'] },
    ],
    mobileApps: [
      { name: 'filebox (statisk)', desc: 'file explorer/manager', image: ['/featured-projects/mobile-apps/filebox.png'], techstack: ['React Native', 'ReactJS'] },
      { name: 'vereefy (statisk)', desc: 'enkel id-verifisering', image: ['/featured-projects/mobile-apps/vereefy/vereefy-login.png', '/featured-projects/mobile-apps/vereefy/vereefy-id.png', '/featured-projects/mobile-apps/vereefy/vereefy-option-prompt.png'], techstack: ['React Native', 'ReactJS'] },
    ],
    contributions: [
      { name: '<pin/>', desc: 'landingsside for <pin/>', link: 'https://pin.rootlinjeforening.no/', image: '/featured-projects/contributions/pin.png', mobileImage: '/featured-projects/mobile/contributions/m-pin.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/Project-insert-name/PIN", collaborators: [{name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal"}] },
      { name: 'fribyte', desc: 'landingsside for fribyte', link: 'https://fribyte.no/', image: '/featured-projects/contributions/fribyte.png', mobileImage: '/featured-projects/mobile/contributions/m-fribyte.png', techstack: ['Zola', 'SCSS'], onGithub: "https://github.com/fribyte-code/fribyte.no" },
      { name: 'fribyte ctf', desc: 'fribyte sin capture the flag plattform', link: 'https://ctf.fribyte.no/', image: '/featured-projects/contributions/fribyte-ctf.png', mobileImage: '/featured-projects/mobile/contributions/m-fribyte-ctf.png', techstack: ['ViteJS', 'ReactJS', 'TypeScript', '.NET', 'CSS'], onGithub: "https://github.com/fribyte-code/friByte.capture-the-flag" },
      { name: 'boskonf', dateAdded: '02.08.2024', desc: 'bergen open source konferanse', link: 'https://boskonf.no/', image: '/featured-projects/contributions/boskonf.png', mobileImage: '/featured-projects/mobile/contributions/m-boskonf.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'CSS'], onGithub: "https://github.com/fribyte-code/boskonf.no" },
      { name: 'fribyte wiki', desc: 'fribyte sin interne wiki', link: 'https://wiki.fribyte.no/', image: '/featured-projects/contributions/fribyte-wiki.png', mobileImage: '/featured-projects/mobile/contributions/m-fribyte-wiki.png', techstack: ['Zola', 'SCSS'], onGithub: "https://github.com/fribyte-code/wiki" },
      { name: 'root', desc: 'linjeforening for data og it ved hvl bergen', link: 'https://www.rootlinjeforening.no/', image: '/featured-projects/contributions/root.png', mobileImage: '/featured-projects/mobile/contributions/m-root.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS', 'Sanity'], onGithub: "https://github.com/Project-insert-name/root-website" },
      { name: 'kledeli', desc: 'abonnementsplattform for barneklær', link: 'https://kledeli.nheek.com/', image: '/featured-projects/contributions/kledeli.png', mobileImage: '/featured-projects/mobile/contributions/m-kledeli.png', techstack: ['PHP', 'JavaScript', 'jQuery', 'MySQL', 'TailwindCSS'], collaborators: [{name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal"}] },
      { name: 'sipscore', dateAdded: '22.09.24', desc: 'alkoholforbruk tracker', link: 'https://sipscore.patreek.no/', image: '/featured-projects/contributions/sipscore.png', mobileImage: '/featured-projects/mobile/contributions/m-sipscore.png', techstack: ['NextJS', 'ReactJS', 'NodeJS', 'TypeScript', 'PostgreSQL', 'TailwindCSS'], collaborators: [{name: "Patrik Thormodsen", link: "https://github.com/pthormodsen"}], deployedWith: ["docker", "github actions"] },
      { name: 'homing', status: 'under arbeid', desc: 'sosiale medie melding webapp', link: 'https://homing.lukasry.no/', image: '/featured-projects/contributions/homing.png', techstack: ['PHP', 'JavaScript', 'MySQL', 'JQuery', 'CSS'], collaborators: [{name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal"}] },
      { name: 'kvarteret', dateAdded: '13.04.2024', status: 'under arbeid', desc: 'studentkulturhuset', link: 'https://kvarteret.no/', image: '/featured-projects/contributions/kvarteret.png', mobileImage: '/featured-projects/mobile/contributions/m-kvarteret.png', techstack: ['AstroJS', 'ReactJS', 'GraphQL', 'Directus', 'CSS'] },
      { name: 'bybane quiz', dateAdded: '19.06.2024', desc: 'quiz spill basert på bybane', link: 'https://bybane-quiz.nheek.no/', image: '/featured-projects/contributions/bybane-quiz.png', mobileImage: '/featured-projects/mobile/contributions/m-bybane-quiz.png', techstack: ['AstroJS', 'NodeJS', 'CSS'], collaborators: [{name: "Aggi", link: "https://github.com/aggicreative555"}, {name: "Ole Martin Amundsen", link: "https://github.com/671454"}], deployedWith: ["docker", "github actions"] },
    ],
    static: [
      { name: 'lady', desc: 'nettbasert matserveringstjeneste', link: 'https://lady.nheek.com/', image: '/featured-projects/static/lady.png', mobileImage: '/featured-projects/mobile/static/m-lady.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS'] },
      { name: 'techie', desc: 'landingsside for tech-produkter', link: 'https://techie.nheek.com/', image: '/featured-projects/static/techie.png', mobileImage: '/featured-projects/mobile/static/m-techie.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/techie" },
      { name: 'arch', desc: 'landingsside for interiørdesign', link: 'https://arch.nheek.com/', image: '/featured-projects/static/arch.png', techstack: ['ReactJS', 'ViteJS', 'TypeScript', 'CSS'] },
      { name: 'bould', desc: 'forsidebildefokusert bloggplattform', link: 'https://bould.nheek.com/', image: '/featured-projects/bould.png', mobileImage: '/featured-projects/mobile/m-bould.png', techstack: ['AstroJS', 'NodeJS', 'TypeScript', 'TailwindCSS'], onGithub: "https://github.com/nheek/bould" },
      { name: 'kinder', dateAdded: '03.08.2024', desc: 'barnehage landingsside', link: 'https://kinder.nheek.com/', image: '/featured-projects/static/kinder.png', techstack: ['SvelteKit', 'TypeScript', 'CSS'], deployedWith: ["docker", "github actions"] },
      { name: 'ingo', dateAdded: '23.07.2024', desc: 'utenlands reisesporing', link: 'https://ingo.nheek.com/', image: '/featured-projects/static/ingo.png', techstack: ['NextJS', 'ReactJS', 'TypeScript', 'TailwindCSS'], deployedWith: ["docker", "github actions"] },
      { name: 'truhvel', dateAdded: '09.04.2024', desc: 'landingsside for undervannsutforskning', link: 'https://truhvel.nheek.com/', image: '/featured-projects/static/truhvel.png', techstack: ['VueJS', 'ViteJS', 'TypeScript', 'CSS'] },
    ],
    template: [
      { name: 'hexrovk', status: 'vedlikehold', desc: 'sosial medieplattform', link: 'https://hexrovk.nheek.com/', image: '/featured-projects/template/hexrovk.png', mobileImage: '/featured-projects/mobile/template/m-hexrovk.png', techstack: ['PHP', 'JavaScript', 'MySQL', 'JQuery', 'CSS'] },
      { name: 'yloizah', desc: 'portefølje for virtuell lederassistent', link: 'https://yloizah.nheek.com/', image: '/featured-projects/template/yloizah.png', mobileImage: '/featured-projects/mobile/template/m-yloizah.png', techstack: ['NextJS', 'ReactJS', 'Bootstrap', 'SCSS'] },
      { name: 'wine', dateAdded: '02.08.2024', desc: 'moteblogg', link: 'https://wine.nheek.com/', image: '/featured-projects/template/wine.png', techstack: ['WordPress', 'PHP', 'JavaScript', 'CSS'], deployedWith: ["docker", "github actions"]  },
      { name: 'grownoo', status: 'vedlikehold', desc: 'landingsside for videoproduksjonsbyrå', link: 'https://grownoo.nheek.com/', image: '/featured-projects/template/grownoo.png', mobileImage: '/featured-projects/mobile/template/m-grownoo.png', techstack: ['WordPress', 'PHP', 'JavaScript', 'CSS'] },
    ],
  };

  const wwwNheekNo = {
    projectsToShowMap: projects_no,
    contributions: "disse er prosjekter jeg har bidratt til",
    static: "disse er ikke funksjonelle nettsteder/apper",
    template: "disse er nettsteder/apper jeg delvis har kodet",
    deployedWith: "deployert med",
    with: "med"
  };
  const wwwDefault = {
    projectsToShowMap: projects,
    contributions: "these are projects i have contributed to",
    static: "these are non-functional websites/applications",
    template: "these are websites/apps i partially coded",
    deployedWith: "deployed with",
    with: "with"
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault
  };
  const textsMap = GetTextsMap(domainPairs);
  const divRef = useRef(null);
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
    if (currentPage > 1 && divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div ref={divRef} className="relative text-3xl leading-snug flex flex-col md:flex-row items-center justify-center gap-[7%] flex-wrap">
          <span className="text-lg -mb-8 md:mb-0 mt-4 md:absolute top-0 italic opacity-60">
          {txtInfo[category] || ""}
        </span>
        {projectsToShow.map((project, index) => (
          <FeaturedProjectsItemItem key={"projects-to-show-" + index} category={category} project={project} txtInfo={txtInfo} />
        ))}
      </div>
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

interface FeaturedProjectsItemProps {
 category?: string;
}