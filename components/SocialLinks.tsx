export default function SocialLinks() {
  const socials = [
    {
      name: "facebook",
      link: "https://www.facebook.com/nick.james.1622",
      icon: "social-links/facebook-iconx.svg",
    },
    {
      name: "instagram",
      link: "https://www.instagram.com/nick.mmrdl/",
      icon: "social-links/instagram-iconx.svg",
    },
    {
      name: "linkedin",
      link: "https://www.linkedin.com/in/nheek/",
      icon: "social-links/linkedin-iconx.svg",
    },
    {
      name: "github",
      link: "https://github.com/nheek",
      icon: "social-links/github-iconx.svg",
    },
  ];

  return (
    <div className="mt-20 px-4 py-4 flex items-center justify-center">
      {socials.map((social, index) => (
        <div key={"socials-" + index} className="group w-[25%] text-center">
          <a href={social.link} target="_blank" className="!no-underline">
            <button className="w-[60%] h-10 md:h-[unset] flex gap-2 group-hover:gap-5 items-center justify-center px-2 py-4 m-auto text-center text-xl leading-[normal] duration-200">
              <div>
                <img
                  className=""
                  src={social.icon}
                  alt={social.name + " icon"}
                />
              </div>
              <div className="hidden md:block !no-underline">
                {social.name}
              </div>
            </button>
          </a>
        </div>
      ))}
    </div>
  );
}
