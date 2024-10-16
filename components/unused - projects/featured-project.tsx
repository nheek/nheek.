import GetTextsMap from "../GetTextsMap";
import FeaturedProjects from "../FeaturedProjects";

export default function FeaturedProject({
  category = "websites",
  projectName = "nheek",
}: FeaturedProjectsProps) {
  const projects = {
    websites: [
      {
        name: "nheek",
        desc: "this portfolio website",
        link: "https://www.nheek.com/",
        image: "/featured-projects/nheek.png",
        mobileImage: "/featured-projects/mobile/m-nheek.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
        onGithub: "https://github.com/nheek/nheek.",
        deployedWith: ["docker", "github actions"],
      },
      {
        name: "raincheck",
        desc: "weather web app",
        link: "https://raincheck.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/7692a65c-2419-4723-84cf-4811f766e1a4.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/4af41197-df9b-4f2d-a12f-353d921d53a3.png",
        techstack: ["Django", "Python", "JavaScript", "TailwindCSS"],
      },
      {
        name: "wee",
        desc: "link shortening platform",
        link: "https://wee.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/cad381cd-d697-4f93-a551-aeab784fe386.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/e1812085-2069-41c4-abfe-7b213fc7ff83.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
        deployedWith: ["docker", "github actions"],
      },
      {
        name: "shareme",
        desc: "no-login todo list web app",
        link: "https://shareme.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/f4bab468-2415-45c9-84d9-b1c92472c787.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/8bdfa8ef-d302-41cd-825b-45e9fe3f2831.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL", "TailwindCSS"],
        onGithub: "https://github.com/nheek/shareme",
      },
      {
        name: "notasrare",
        desc: "public poll platform",
        link: "https://notasrare.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/78658685-4a64-4704-a53b-e50d6f29366b.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/0c767bba-d50b-4972-aa7c-e395e8120005.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
      },
      {
        name: "motto",
        desc: "virtual friend app",
        link: "https://motto.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/0efebd08-b026-434a-9ea1-5646b150319e.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/a950f0c6-0a1b-4aca-a731-3cb8286ebd1e.png",
        techstack: ["NextJS", "ReactJS", "NodeJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/motto",
      },
      {
        name: "lookatme",
        desc: "real-time statistics entertainment platform",
        link: "https://lookatme.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/839ad939-799e-41ac-a2e5-fb1bc97835c2.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/187967f1-92c7-45c7-9c99-96e59c382d2b.png",
        techstack: ["ExpressJS", "MySQL", "TailwindCSS", "Socket.IO"],
      },
      {
        name: "bould",
        desc: "cover photo focused blog platform",
        link: "https://bould.nheek.com/",
        image: "/featured-projects/bould.png",
        mobileImage: "/featured-projects/mobile/m-bould.png",
        techstack: ["AstroJS", "NodeJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/bould",
      },
      {
        name: "swiftgoss",
        desc: "anonymous social media platform",
        link: "https://swiftgoss.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/ec0c9f1f-af8b-4943-96d0-4a1aa6113b72.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/a8f3eea8-bfb4-4f13-a847-591e736e33c4.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "studently",
        desc: "schools forum platform",
        link: "https://studently.nheek.com/",
        image: "/featured-projects/studently.png",
        mobileImage: "/featured-projects/mobile/m-studently.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "confy",
        desc: "anonymous confession site",
        link: "https://confy.nheek.com/",
        image: "/featured-projects/confy.png",
        techstack: [
          "RemixJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
      },
      {
        name: "poetree",
        desc: "google-inspired poetry library",
        link: "https://poetree.nheek.com/",
        image: "/featured-projects/poetree.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "malky",
        desc: "intelligent virtual ai assistant",
        link: "https://malky.nheek.com/",
        image: "/featured-projects/malky.png",
        mobileImage: "/featured-projects/mobile/m-malky.png",
        techstack: ["NextJS", "ReactJS", "NodeJS", "TypeScript", "TailwindCSS"],
      },
    ],
    apps: [
      {
        name: "simple calculator",
        desc: "simple calculator application",
        link: "https://python.nheek.com/codes/simple_calculator?from_nheek=true",
        image: "/featured-projects/python/simple_calculator.png",
        techstack: ["Python", "PyQt6"],
      },
      {
        name: "weather",
        desc: "minimalistic weather application",
        link: "https://python.nheek.com/codes/weather?from_nheek=true",
        image: "/featured-projects/python/weather.png",
        techstack: ["Python", "PyQt6"],
      },
      {
        name: "password generator",
        desc: "secure password generator application",
        link: "#",
        image: "/featured-projects/python/password_generator.png",
        techstack: ["Python", "PyQt6"],
      },
    ],
    contributions: [
      {
        name: "<pin/>",
        desc: "landing page for <pin/>",
        link: "https://pin.rootlinjeforening.no/",
        image: "/featured-projects/contributions/pin.png",
        mobileImage: "/featured-projects/mobile/contributions/m-pin.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/Project-insert-name/PIN",
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
      {
        name: "fribyte",
        desc: "landing page for fribyte",
        link: "https://fribyte.no/",
        image: "/featured-projects/contributions/fribyte.png",
        mobileImage: "/featured-projects/mobile/contributions/m-fribyte.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/fribyte.no",
      },
      {
        name: "fribyte ctf",
        desc: "fribyte's own capture the flag platform",
        link: "https://ctf.fribyte.no/",
        image: "/featured-projects/contributions/fribyte-ctf.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-ctf.png",
        techstack: ["ViteJS", "ReactJS", "TypeScript", ".NET", "CSS"],
        onGithub: "https://github.com/fribyte-code/friByte.capture-the-flag",
      },
      {
        name: "fribyte wiki",
        desc: "fribyte's internal wiki",
        link: "https://wiki.fribyte.no/",
        image: "/featured-projects/contributions/fribyte-wiki.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-wiki.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/wiki",
      },
      {
        name: "kledeli",
        desc: "children clothing subscription platform",
        link: "https://kledeli.nheek.com/",
        image: "/featured-projects/contributions/kledeli.png",
        mobileImage: "/featured-projects/mobile/contributions/m-kledeli.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL", "TailwindCSS"],
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
    ],
    static: [
      {
        name: "lady",
        desc: "food service online platform",
        link: "https://lady.nheek.com/",
        image: "/featured-projects/static/lady.png",
        mobileImage: "/featured-projects/mobile/static/m-lady.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
      },
      {
        name: "techie",
        desc: "tech product landing page",
        link: "https://techie.nheek.com/",
        image: "/featured-projects/static/techie.png",
        mobileImage: "/featured-projects/mobile/static/m-techie.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/techie",
      },
    ],
    template: [
      {
        name: "hexrovk",
        desc: "social media platform",
        link: "https://hexrovk.nheek.com/",
        image: "/featured-projects/template/hexrovk.png",
        mobileImage: "/featured-projects/mobile/template/m-hexrovk.png",
        techstack: ["PHP", "JavaScript", "MySQL", "JQuery", "CSS"],
      },
      {
        name: "yloizah",
        desc: "executive virtual assistant portfolio",
        link: "https://yloizah.nheek.com/",
        image: "/featured-projects/template/yloizah.png",
        mobileImage: "/featured-projects/mobile/template/m-yloizah.png",
        techstack: ["NextJS", "ReactJS", "Bootstrap", "SCSS"],
      },
      {
        name: "grownoo",
        desc: "video production agency landing page",
        link: "https://grownoo.nheek.com/",
        image: "/featured-projects/template/grownoo.png",
        mobileImage: "/featured-projects/mobile/template/m-grownoo.png",
        techstack: ["WordPress", "PHP", "JavaScript", "CSS"],
      },
    ],
  };
  const projects_no = {
    websites: [
      {
        name: "nheek",
        desc: "denne portefølje nettsiden",
        link: "https://www.nheek.no/",
        image: "/featured-projects/nheek-no.png",
        mobileImage: "/featured-projects/mobile/m-nheek.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
        onGithub: "https://github.com/nheek/nheek.",
        deployedWith: ["docker", "github actions"],
      },
      {
        name: "raincheck",
        desc: "vær web app",
        link: "https://raincheck.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/7692a65c-2419-4723-84cf-4811f766e1a4.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/4af41197-df9b-4f2d-a12f-353d921d53a3.png",
        techstack: ["Django", "Python", "JavaScript", "TailwindCSS"],
      },
      {
        name: "wee",
        desc: "lenkeforkortingsplattform",
        link: "https://wee.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/cad381cd-d697-4f93-a551-aeab784fe386.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/e1812085-2069-41c4-abfe-7b213fc7ff83.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
        deployedWith: ["docker", "github actions"],
      },
      {
        name: "shareme",
        desc: "no-login todo list web app",
        link: "https://shareme.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/f4bab468-2415-45c9-84d9-b1c92472c787.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/8bdfa8ef-d302-41cd-825b-45e9fe3f2831.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL", "TailwindCSS"],
        onGithub: "https://github.com/nheek/shareme",
      },
      {
        name: "notasrare",
        desc: "offentlig avstemningsplattform",
        link: "https://notasrare.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/78658685-4a64-4704-a53b-e50d6f29366b.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/0c767bba-d50b-4972-aa7c-e395e8120005.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
      },
      {
        name: "motto",
        desc: "virtuell venn app",
        link: "https://motto.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/0efebd08-b026-434a-9ea1-5646b150319e.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/a950f0c6-0a1b-4aca-a731-3cb8286ebd1e.png",
        techstack: ["NextJS", "ReactJS", "NodeJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/motto",
      },
      {
        name: "lookatme",
        desc: "real-time statistikk underholdningsplattform",
        link: "https://lookatme.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/839ad939-799e-41ac-a2e5-fb1bc97835c2.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/187967f1-92c7-45c7-9c99-96e59c382d2b.png",
        techstack: ["ExpressJS", "MySQL", "TailwindCSS", "Socket.IO"],
      },
      {
        name: "bould",
        desc: "forsidebildefokusert bloggplattform",
        link: "https://bould.nheek.com/",
        image: "/featured-projects/bould.png",
        mobileImage: "/featured-projects/mobile/m-bould.png",
        techstack: ["AstroJS", "NodeJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/bould",
      },
      {
        name: "swiftgoss",
        desc: "anonym sosiale medie",
        link: "https://swiftgoss.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/ec0c9f1f-af8b-4943-96d0-4a1aa6113b72.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/a8f3eea8-bfb4-4f13-a847-591e736e33c4.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "studently",
        desc: "skolens forumplattform",
        link: "https://studently.nheek.com/",
        image: "/featured-projects/studently.png",
        mobileImage: "/featured-projects/mobile/m-studently.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "confy",
        desc: "anonym confession side",
        link: "https://confy.nheek.com/",
        image: "/featured-projects/confy.png",
        techstack: [
          "RemixJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
      },
      {
        name: "poetree",
        desc: "google-inspirert poesibibliotek",
        link: "https://poetree.nheek.com/",
        image: "/featured-projects/poetree.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "malky",
        desc: "intelligent virtuell ki-assistant",
        link: "https://malky.nheek.com/",
        image: "/featured-projects/malky.png",
        mobileImage: "/featured-projects/mobile/m-malky.png",
        techstack: ["NextJS", "ReactJS", "NodeJS", "TypeScript", "TailwindCSS"],
      },
    ],
    apps: [
      {
        name: "enkel kalkulator",
        desc: "enkel kalkulator applikasjon",
        link: "https://python.nheek.com/codes/simple_calculator?from_nheek=true",
        image: "/featured-projects/python/simple_calculator.png",
        techstack: ["Python", "PyQt6"],
      },
      {
        name: "vær",
        desc: "minimalistisk vær applikasjon",
        link: "https://python.nheek.com/codes/weather?from_nheek=true",
        image: "/featured-projects/python/weather.png",
        techstack: ["Python", "PyQt6"],
      },
      {
        name: "passordgenerering",
        desc: "sikker passordgenerering applikasjon",
        link: "#",
        image: "/featured-projects/python/password_generator.png",
        techstack: ["Python", "PyQt6"],
      },
    ],
    contributions: [
      {
        name: "<pin/>",
        desc: "landingsside for <pin/>",
        link: "https://pin.rootlinjeforening.no/",
        image: "/featured-projects/contributions/pin.png",
        mobileImage: "/featured-projects/mobile/contributions/m-pin.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/Project-insert-name/PIN",
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
      {
        name: "fribyte",
        desc: "landingsside for fribyte",
        link: "https://fribyte.no/",
        image: "/featured-projects/contributions/fribyte.png",
        mobileImage: "/featured-projects/mobile/contributions/m-fribyte.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/fribyte.no",
      },
      {
        name: "fribyte ctf",
        desc: "fribyte sin capture the flag plattform",
        link: "https://ctf.fribyte.no/",
        image: "/featured-projects/contributions/fribyte-ctf.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-ctf.png",
        techstack: ["ViteJS", "ReactJS", "TypeScript", ".NET", "CSS"],
        onGithub: "https://github.com/fribyte-code/friByte.capture-the-flag",
      },
      {
        name: "fribyte wiki",
        desc: "fribyte sin interne wiki",
        link: "https://wiki.fribyte.no/",
        image: "/featured-projects/contributions/fribyte-wiki.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-wiki.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/wiki",
      },
      {
        name: "kledeli",
        desc: "abonnementsplattform for barneklær",
        link: "https://kledeli.nheek.com/",
        image: "/featured-projects/contributions/kledeli.png",
        mobileImage: "/featured-projects/mobile/contributions/m-kledeli.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL", "TailwindCSS"],
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
    ],
    static: [
      {
        name: "lady",
        desc: "nettbasert matserveringstjeneste",
        link: "https://lady.nheek.com/",
        image: "/featured-projects/static/lady.png",
        mobileImage: "/featured-projects/mobile/static/m-lady.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
      },
      {
        name: "techie",
        desc: "landingsside for tech-produkter",
        link: "https://techie.nheek.com/",
        image: "/featured-projects/static/techie.png",
        mobileImage: "/featured-projects/mobile/static/m-techie.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/techie",
      },
    ],
    template: [
      {
        name: "hexrovk",
        desc: "sosial medieplattform",
        link: "https://hexrovk.nheek.com/",
        image: "/featured-projects/template/hexrovk.png",
        mobileImage: "/featured-projects/mobile/template/m-hexrovk.png",
        techstack: ["PHP", "JavaScript", "MySQL", "JQuery", "CSS"],
      },
      {
        name: "yloizah",
        desc: "portefølje for virtuell lederassistent",
        link: "https://yloizah.nheek.com/",
        image: "/featured-projects/template/yloizah.png",
        mobileImage: "/featured-projects/mobile/template/m-yloizah.png",
        techstack: ["NextJS", "ReactJS", "Bootstrap", "SCSS"],
      },
      {
        name: "grownoo",
        desc: "landingsside for videoproduksjonsbyrå",
        link: "https://grownoo.nheek.com/",
        image: "/featured-projects/template/grownoo.png",
        mobileImage: "/featured-projects/mobile/template/m-grownoo.png",
        techstack: ["WordPress", "PHP", "JavaScript", "CSS"],
      },
    ],
  };

  const projects_fullstack = {
    websites: [
      {
        name: "nheek",
        desc: "this portfolio website",
        link: "https://www.nheek.com/",
        image: "/featured-projects/nheek.png",
        mobileImage: "/featured-projects/mobile/m-nheek.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
        onGithub: "https://github.com/nheek/nheek.",
        deployedWith: ["docker", "github actions"],
      },
      {
        name: "raincheck",
        desc: "weather web app",
        link: "https://raincheck.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/7692a65c-2419-4723-84cf-4811f766e1a4.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/4af41197-df9b-4f2d-a12f-353d921d53a3.png",
        techstack: ["Django", "Python", "JavaScript", "TailwindCSS"],
      },
      {
        name: "wee",
        desc: "link shortening platform",
        link: "https://wee.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/cad381cd-d697-4f93-a551-aeab784fe386.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/e1812085-2069-41c4-abfe-7b213fc7ff83.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
        deployedWith: ["docker", "github actions"],
      },
      {
        name: "shareme",
        desc: "no-login todo list web app",
        link: "https://shareme.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/f4bab468-2415-45c9-84d9-b1c92472c787.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/8bdfa8ef-d302-41cd-825b-45e9fe3f2831.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL", "TailwindCSS"],
        onGithub: "https://github.com/nheek/shareme",
      },
      {
        name: "notasrare",
        desc: "public poll platform",
        link: "https://notasrare.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/78658685-4a64-4704-a53b-e50d6f29366b.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/0c767bba-d50b-4972-aa7c-e395e8120005.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
      },
      {
        name: "motto",
        desc: "virtual friend app",
        link: "https://motto.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/0efebd08-b026-434a-9ea1-5646b150319e.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/a950f0c6-0a1b-4aca-a731-3cb8286ebd1e.png",
        techstack: ["NextJS", "ReactJS", "NodeJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/motto",
      },
      {
        name: "lookatme",
        desc: "real-time statistics entertainment platform",
        link: "https://lookatme.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/839ad939-799e-41ac-a2e5-fb1bc97835c2.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/187967f1-92c7-45c7-9c99-96e59c382d2b.png",
        techstack: ["ExpressJS", "MySQL", "TailwindCSS", "Socket.IO"],
      },
      {
        name: "bould",
        desc: "cover photo focused blog platform",
        link: "https://bould.nheek.com/",
        image: "/featured-projects/bould.png",
        mobileImage: "/featured-projects/mobile/m-bould.png",
        techstack: ["AstroJS", "NodeJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/bould",
      },
      {
        name: "swiftgoss",
        desc: "anonymous social media platform",
        link: "https://swiftgoss.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/ec0c9f1f-af8b-4943-96d0-4a1aa6113b72.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/a8f3eea8-bfb4-4f13-a847-591e736e33c4.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "studently",
        desc: "schools forum platform",
        link: "https://studently.nheek.com/",
        image: "/featured-projects/studently.png",
        mobileImage: "/featured-projects/mobile/m-studently.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "confy",
        desc: "anonymous confession site",
        link: "https://confy.nheek.com/",
        image: "/featured-projects/confy.png",
        techstack: [
          "RemixJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
      },
      {
        name: "poetree",
        desc: "google-inspired poetry library",
        link: "https://poetree.nheek.com/",
        image: "/featured-projects/poetree.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "malky",
        desc: "intelligent virtual ai assistant",
        link: "https://malky.nheek.com/",
        image: "/featured-projects/malky.png",
        mobileImage: "/featured-projects/mobile/m-malky.png",
        techstack: ["NextJS", "ReactJS", "NodeJS", "TypeScript", "TailwindCSS"],
      },
    ],
    apps: [
      {
        name: "simple calculator",
        desc: "simple calculator application",
        link: "https://python.nheek.com/codes/simple_calculator?from_nheek=true",
        image: "/featured-projects/python/simple_calculator.png",
        techstack: ["Python", "PyQt6"],
      },
      {
        name: "weather",
        desc: "minimalistic weather application",
        link: "https://python.nheek.com/codes/weather?from_nheek=true",
        image: "/featured-projects/python/weather.png",
        techstack: ["Python", "PyQt6"],
      },
      {
        name: "password generator",
        desc: "secure password generator application",
        link: "#",
        image: "/featured-projects/python/password_generator.png",
        techstack: ["Python", "PyQt6"],
      },
    ],
    contributions: [
      {
        name: "<pin/>",
        desc: "landing page for <pin/>",
        link: "https://pin.rootlinjeforening.no/",
        image: "/featured-projects/contributions/pin.png",
        mobileImage: "/featured-projects/mobile/contributions/m-pin.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/Project-insert-name/PIN",
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
      {
        name: "fribyte",
        desc: "landing page for fribyte",
        link: "https://fribyte.no/",
        image: "/featured-projects/contributions/fribyte.png",
        mobileImage: "/featured-projects/mobile/contributions/m-fribyte.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/fribyte.no",
      },
      {
        name: "fribyte ctf",
        desc: "fribyte's own capture the flag platform",
        link: "https://ctf.fribyte.no/",
        image: "/featured-projects/contributions/fribyte-ctf.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-ctf.png",
        techstack: ["ViteJS", "ReactJS", "TypeScript", ".NET", "CSS"],
        onGithub: "https://github.com/fribyte-code/friByte.capture-the-flag",
      },
      {
        name: "fribyte wiki",
        desc: "fribyte's internal wiki",
        link: "https://wiki.fribyte.no/",
        image: "/featured-projects/contributions/fribyte-wiki.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-wiki.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/wiki",
      },
      {
        name: "kledeli",
        desc: "children clothing subscription platform",
        link: "https://kledeli.nheek.com/",
        image: "/featured-projects/contributions/kledeli.png",
        mobileImage: "/featured-projects/mobile/contributions/m-kledeli.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL", "TailwindCSS"],
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
      {
        name: "homing",
        desc: "social media messaging web app",
        link: "https://homing.lukasry.no/",
        image: "/featured-projects/contributions/homing.png",
        techstack: ["PHP", "JavaScript", "MySQL", "JQuery", "CSS"],
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
    ],
    static: [
      {
        name: "lady",
        desc: "food service online platform",
        link: "https://lady.nheek.com/",
        image: "/featured-projects/static/lady.png",
        mobileImage: "/featured-projects/mobile/static/m-lady.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
      },
      {
        name: "techie",
        desc: "tech product landing page",
        link: "https://techie.nheek.com/",
        image: "/featured-projects/static/techie.png",
        mobileImage: "/featured-projects/mobile/static/m-techie.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/techie",
      },
      {
        name: "connect",
        desc: "organisation all around platform",
        link: "https://connect.nheek.com/",
        image: "/featured-projects/static/connect.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
      },
    ],
    template: [
      {
        name: "hexrovk",
        desc: "social media platform",
        link: "https://hexrovk.nheek.com/",
        image: "/featured-projects/template/hexrovk.png",
        mobileImage: "/featured-projects/mobile/template/m-hexrovk.png",
        techstack: ["PHP", "JavaScript", "MySQL", "JQuery", "CSS"],
      },
      {
        name: "yloizah",
        desc: "executive virtual assistant portfolio",
        link: "https://yloizah.nheek.com/",
        image: "/featured-projects/template/yloizah.png",
        mobileImage: "/featured-projects/mobile/template/m-yloizah.png",
        techstack: ["NextJS", "ReactJS", "Bootstrap", "SCSS"],
      },
      {
        name: "grownoo",
        desc: "video production agency landing page",
        link: "https://grownoo.nheek.com/",
        image: "/featured-projects/template/grownoo.png",
        mobileImage: "/featured-projects/mobile/template/m-grownoo.png",
        techstack: ["WordPress", "PHP", "JavaScript", "CSS"],
      },
    ],
  };
  const projects_no_fullstack = {
    websites: [
      {
        name: "nheek",
        desc: "denne portefølje nettsiden",
        link: "https://www.nheek.no/",
        image: "/featured-projects/nheek-no.png",
        mobileImage: "/featured-projects/mobile/m-nheek.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
        onGithub: "https://github.com/nheek/nheek.",
        deployedWith: ["docker", "github actions"],
      },
      {
        name: "raincheck",
        desc: "vær web app",
        link: "https://raincheck.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/7692a65c-2419-4723-84cf-4811f766e1a4.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/4af41197-df9b-4f2d-a12f-353d921d53a3.png",
        techstack: ["Django", "Python", "JavaScript", "TailwindCSS"],
      },
      {
        name: "wee",
        desc: "lenkeforkortingsplattform",
        link: "https://wee.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/cad381cd-d697-4f93-a551-aeab784fe386.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/e1812085-2069-41c4-abfe-7b213fc7ff83.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
        deployedWith: ["docker", "github actions"],
      },
      {
        name: "shareme",
        desc: "no-login todo list web app",
        link: "https://shareme.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/f4bab468-2415-45c9-84d9-b1c92472c787.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/8bdfa8ef-d302-41cd-825b-45e9fe3f2831.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL", "TailwindCSS"],
        onGithub: "https://github.com/nheek/shareme",
      },
      {
        name: "notasrare",
        desc: "offentlig avstemningsplattform",
        link: "https://notasrare.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/78658685-4a64-4704-a53b-e50d6f29366b.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/0c767bba-d50b-4972-aa7c-e395e8120005.png",
        techstack: [
          "NextJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
      },
      {
        name: "motto",
        desc: "virtuell venn app",
        link: "https://motto.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/0efebd08-b026-434a-9ea1-5646b150319e.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/a950f0c6-0a1b-4aca-a731-3cb8286ebd1e.png",
        techstack: ["NextJS", "ReactJS", "NodeJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/motto",
      },
      {
        name: "lookatme",
        desc: "real-time statistikk underholdningsplattform",
        link: "https://lookatme.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/839ad939-799e-41ac-a2e5-fb1bc97835c2.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/187967f1-92c7-45c7-9c99-96e59c382d2b.png",
        techstack: ["ExpressJS", "MySQL", "TailwindCSS", "Socket.IO"],
      },
      {
        name: "bould",
        desc: "forsidebildefokusert bloggplattform",
        link: "https://bould.nheek.com/",
        image: "/featured-projects/bould.png",
        mobileImage: "/featured-projects/mobile/m-bould.png",
        techstack: ["AstroJS", "NodeJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/bould",
      },
      {
        name: "swiftgoss",
        desc: "anonym sosiale medie",
        link: "https://swiftgoss.nheek.com/",
        image:
          "https://uppy.nheek.com/uploads/ec0c9f1f-af8b-4943-96d0-4a1aa6113b72.png",
        mobileImage:
          "https://uppy.nheek.com/uploads/a8f3eea8-bfb4-4f13-a847-591e736e33c4.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "studently",
        desc: "skolens forumplattform",
        link: "https://studently.nheek.com/",
        image: "/featured-projects/studently.png",
        mobileImage: "/featured-projects/mobile/m-studently.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "confy",
        desc: "anonym confession side",
        link: "https://confy.nheek.com/",
        image: "/featured-projects/confy.png",
        techstack: [
          "RemixJS",
          "ReactJS",
          "NodeJS",
          "TypeScript",
          "MySQL",
          "TailwindCSS",
        ],
      },
      {
        name: "poetree",
        desc: "google-inspirert poesibibliotek",
        link: "https://poetree.nheek.com/",
        image: "/featured-projects/poetree.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      },
      {
        name: "malky",
        desc: "intelligent virtuell ki-assistant",
        link: "https://malky.nheek.com/",
        image: "/featured-projects/malky.png",
        mobileImage: "/featured-projects/mobile/m-malky.png",
        techstack: ["NextJS", "ReactJS", "NodeJS", "TypeScript", "TailwindCSS"],
      },
    ],
    apps: [
      {
        name: "enkel kalkulator",
        desc: "enkel kalkulator applikasjon",
        link: "https://python.nheek.com/codes/simple_calculator?from_nheek=true",
        image: "/featured-projects/python/simple_calculator.png",
        techstack: ["Python", "PyQt6"],
      },
      {
        name: "vær",
        desc: "minimalistisk vær applikasjon",
        link: "https://python.nheek.com/codes/weather?from_nheek=true",
        image: "/featured-projects/python/weather.png",
        techstack: ["Python", "PyQt6"],
      },
      {
        name: "passordgenerering",
        desc: "sikker passordgenerering applikasjon",
        link: "#",
        image: "/featured-projects/python/password_generator.png",
        techstack: ["Python", "PyQt6"],
      },
    ],
    contributions: [
      {
        name: "<pin/>",
        desc: "landingsside for <pin/>",
        link: "https://pin.rootlinjeforening.no/",
        image: "/featured-projects/contributions/pin.png",
        mobileImage: "/featured-projects/mobile/contributions/m-pin.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/Project-insert-name/PIN",
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
      {
        name: "fribyte",
        desc: "landingsside for fribyte",
        link: "https://fribyte.no/",
        image: "/featured-projects/contributions/fribyte.png",
        mobileImage: "/featured-projects/mobile/contributions/m-fribyte.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/fribyte.no",
      },
      {
        name: "fribyte ctf",
        desc: "fribyte sin capture the flag plattform",
        link: "https://ctf.fribyte.no/",
        image: "/featured-projects/contributions/fribyte-ctf.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-ctf.png",
        techstack: ["ViteJS", "ReactJS", "TypeScript", ".NET", "CSS"],
        onGithub: "https://github.com/fribyte-code/friByte.capture-the-flag",
      },
      {
        name: "fribyte gaming",
        desc: "fribyte {her_står_nøkkelen} gaming side",
        link: "https://blogs.mtdv.me/watch?v=her_staar_noekkelen",
        image: "/featured-projects/contributions/fribyte-wiki.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-wiki.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/wiki",
      },
      {
        name: "fribyte wiki",
        desc: "fribyte sin interne wiki",
        link: "https://wiki.fribyte.no/",
        image: "/featured-projects/contributions/fribyte-wiki.png",
        mobileImage:
          "/featured-projects/mobile/contributions/m-fribyte-wiki.png",
        techstack: ["Zola", "SCSS"],
        onGithub: "https://github.com/fribyte-code/wiki",
      },
      {
        name: "kledeli",
        desc: "abonnementsplattform for barneklær",
        link: "https://kledeli.nheek.com/",
        image: "/featured-projects/contributions/kledeli.png",
        mobileImage: "/featured-projects/mobile/contributions/m-kledeli.png",
        techstack: ["PHP", "JavaScript", "jQuery", "MySQL", "TailwindCSS"],
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
      {
        name: "homing",
        desc: "sosiale medie melding webapp",
        link: "https://homing.lukasry.no/",
        image: "/featured-projects/contributions/homing.png",
        techstack: ["PHP", "JavaScript", "MySQL", "JQuery", "CSS"],
        collaborators: [
          { name: "Lukas Rysjedal", link: "https://github.com/LukasRysjedal" },
        ],
      },
    ],
    static: [
      {
        name: "lady",
        desc: "nettbasert matserveringstjeneste",
        link: "https://lady.nheek.com/",
        image: "/featured-projects/static/lady.png",
        mobileImage: "/featured-projects/mobile/static/m-lady.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
      },
      {
        name: "techie",
        desc: "landingsside for tech-produkter",
        link: "https://techie.nheek.com/",
        image: "/featured-projects/static/techie.png",
        mobileImage: "/featured-projects/mobile/static/m-techie.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
        onGithub: "https://github.com/nheek/techie",
      },
      {
        name: "connect",
        desc: "organisajon all around plattform",
        link: "https://connect.nheek.com/",
        image: "/featured-projects/static/connect.png",
        techstack: ["NextJS", "ReactJS", "TypeScript", "TailwindCSS"],
      },
    ],
    template: [
      {
        name: "hexrovk",
        desc: "sosial medieplattform",
        link: "https://hexrovk.nheek.com/",
        image: "/featured-projects/template/hexrovk.png",
        mobileImage: "/featured-projects/mobile/template/m-hexrovk.png",
        techstack: ["PHP", "JavaScript", "MySQL", "JQuery", "CSS"],
      },
      {
        name: "yloizah",
        desc: "portefølje for virtuell lederassistent",
        link: "https://yloizah.nheek.com/",
        image: "/featured-projects/template/yloizah.png",
        mobileImage: "/featured-projects/mobile/template/m-yloizah.png",
        techstack: ["NextJS", "ReactJS", "Bootstrap", "SCSS"],
      },
      {
        name: "grownoo",
        desc: "landingsside for videoproduksjonsbyrå",
        link: "https://grownoo.nheek.com/",
        image: "/featured-projects/template/grownoo.png",
        mobileImage: "/featured-projects/mobile/template/m-grownoo.png",
        techstack: ["WordPress", "PHP", "JavaScript", "CSS"],
      },
    ],
  };

  const wwwNheekNo = {
    projectsToShowMap: projects_no,
    contributions: "disse er prosjekter jeg har bidratt til",
    static: "disse er ikke funksjonelle nettsteder/apper",
    template: "disse er nettsteder/apper jeg delvis har kodet",
    deployedWith: "deployert med",
    with: "med",
  };
  const wwwDefault = {
    projectsToShowMap: projects,
    contributions: "these are projects i have contributed to",
    static: "these are non-functional websites/applications",
    template: "these are websites/apps i partially coded",
    deployedWith: "deployed with",
    with: "with",
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };
  const textsMap = GetTextsMap(domainPairs);

  return (
    <div>
      {textsMap.projectsToShowMap[category]?.map(
        (project) =>
          project.name === projectName && (
            <>
              <h1> {project.name} </h1>
              <img src={project.image} alt="" />
            </>
          ),
      )}
    </div>
  );
}

interface FeaturedProjectsProps {
  category?: string;
  projectName?: string;
}
