import getTextsMap from '../get-texts-map';

export default function Links() {
  const links = [
    { name: "Mathias", link: "https://mathiash98.github.io/", desc: "Portfolio website of Mathias (member of fribyte)" },
    { name: "Bergen Font", link: "https://bergenfont.no", desc: "Font Archive by Erik G. Ingebrigtsen (member of fribyte)" },
  ]

  const links_no = [
    { name: "Mathias", link: "https://mathiash98.github.io/", desc: "Nettsiden til Mathias (fribyte medlem)" },
    { name: "Bergen Font", link: "https://bergenfont.no", desc: "Font Arkiv av Erik G. Ingebrigtsen (fribyte medlem)" },
  ]

  const wwwNheekNo = {
    txtLinks: 'lenker',
    links: links_no,
  };
  
  const wwwDefault = {
    txtLinks: 'links',
    links: links,
  };
  
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  }

  let textsMap = getTextsMap(domainPairs);

  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
        <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
          {textsMap.txtLinks}
        </hgroup>
        <div className="flex flex-wrap gap-4 text-lg w-full md:w-[90%] mt-16 m-auto leading-8">
          <ul className="flex flex-col gap-4">
            {
              textsMap.links.map((link, index) => (
                <li>
                  <a
                    className="shadow-inner-blue inset-y-0 inset-x-0 p-4 rounded-3xl !no-underline"
                    href={link.link}
                  >
                    {`${link.name} - ${link.desc}`}
                  </a>
                </li>
              ))
            }
          </ul>
        </div>
    </section>
  );
}