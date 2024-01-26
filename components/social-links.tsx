export default function SocialLinks() {
  const socials = [
    {
      "name": "facebook",
      "link": "https://www.facebook.com/nheek.mmrdl",
      "icon": "social-links/facebook-iconx.svg"
    },
    {
      "name": "instagram",
      "link": "https://www.instagram.com/nick.mmrdl/",
      "icon": "social-links/instagram-iconx.svg"
    },
    {
      "name": "linkedin",
      "link": "https://www.linkedin.com/in/nheek/",
      "icon": "social-links/linkedin-iconx.svg"
    },
    {
      "name": "github",
      "link": "https://github.com/nheek",
      "icon": "social-links/github-iconx.svg"
    }
  ]

  return (
      <div className="mt-20 px-4 py-4 flex items-center justify-center">
        {
          socials.map((social, index) => (
            <div 
              key={index}
              className="w-1/3 text-center">
              <a href={social.link} target="_blank" className="!no-underline">
                <button className="w-[75%] h-10 md:h-[unset] flex gap-2 items-center justify-center p-4 m-auto border-2 border-solid border-gray-200 text-center text-xl leading-[normal] rounded-3xl hover:bg-gray-200 hover:text-blue-950 duration-500">
                  <div>
                    <img src={social.icon} alt={social.name + ' icon'} />
                  </div>
                  <div className="hidden md:block !no-underline">
                    {social.name}
                  </div>
                </button>
              </a>
            </div>
          ))
        }
      </div>
  );
}