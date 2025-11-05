export default function Links() {
  const links = [
    {
      name: "mathias haugsbø",
      link: "https://mathiash98.github.io/",
      desc: "portfolio website of mathias haugsbø (fribyte member)",
    },
    {
      name: "bergen font",
      link: "https://bergenfont.no",
      desc: "font archive by erik g. ingebrigtsen (fribyte member)",
    },
    {
      name: "moldescriptor",
      link: "https://moldescriptor.com/",
      desc: "input molecules to calculate various descriptors by johannes lysne (fribyte member)",
    },
    {
      name: "sindre kjelsrud",
      link: "https://kjelsrud.dev/",
      desc: "portfolio website of sindre kjelsrud (fribyte member)",
    },
    {
      name: "adam remøy",
      link: "https://www.aadam.no/",
      desc: "portfolio website of adam remøy (root and fribyte member)",
    },
    {
      name: "christian engelsen",
      link: "https://cengelsen.no/",
      desc: "portfolio website of christian engelsen (fribyte member)",
    },
    {
      name: "rolf glomsrud",
      link: "https://polsevev.dev/",
      desc: "portfolio website of rolf glomsrud (fribyte member)",
    },
    {
      name: "simen strømsnes",
      link: "https://simsine.no/",
      desc: "portfolio website of simen strømsnes (root and fribyte member)",
    },
  ];
  links.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full md:w-[80%] mx-auto mt-12 md:mt-20">
      <div className="flex flex-wrap gap-4 text-lg w-full md:w-[90%] mt-16 m-auto leading-8">
        <ul className="flex flex-col gap-8">
          {links.map((link, index) => (
            <li
              key={"link" + index}
              className="border-l-4 border-gray-300 border-opacity-50 px-4 py-2 !no-underline"
            >
              <a href={link.link} target="_blank" rel="noopener noreferrer">
                {link.name} -<span className="opacity-60"> {link.desc}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
