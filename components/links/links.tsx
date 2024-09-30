import getTextsMap from "../GetTextsMap";

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
  ];

  const links_no = [
    {
      name: "mathias haugsbø",
      link: "https://mathiash98.github.io/",
      desc: "nettsiden til mathias haugsbø (fribyte medlem)",
    },
    {
      name: "bergen font",
      link: "https://bergenfont.no",
      desc: "font arkiv av erik g. ingebrigtsen (fribyte medlem)",
    },
    {
      name: "moldescriptor",
      link: "https://moldescriptor.com/",
      desc: "input molecules to calculate various descriptors by johannes lysne (fribyte member)",
    },
    {
      name: "sindre kjelsrud",
      link: "https://kjelsrud.dev/",
      desc: "nettsiden til sindre kjelsrud (fribyte medlem)",
    },
  ];

  const wwwNheekNo = {
    txtLinks: "lenker",
    links: links_no,
  };

  const wwwDefault = {
    txtLinks: "links",
    links: links,
  };

  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };

  let textsMap = getTextsMap(domainPairs);

  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
        {textsMap.txtLinks}
      </hgroup>
      <div className="flex flex-wrap gap-4 text-lg w-full md:w-[90%] mt-16 m-auto leading-8">
        <ul className="flex flex-col gap-8">
          {textsMap.links.map((link, index) => (
            <li
              key={"link" + index}
              className="shadow-inner-blue inset-y-0 inset-x-0 p-4 rounded-3xl !no-underline"
            >
              <a href={link.link} target="_blank">
                {`${link.name} - ${link.desc}`}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
