import { useState } from 'react';

export default function FeaturedProjectsItemItem ({project = null, txtInfo = null}) {
    const [projectImage, setProjectImage] = useState(project.image);

    const changeImage = () => {
        let imageToSet = projectImage == project.image ? project.mobileImage : project.image;
        setProjectImage(imageToSet);
    };

    return (
        <div className="w-full md:w-[40%] md:h-[500px] mt-16">
              <img className="max-h-[400px] rounded-xl shadow-lg mx-auto" src={projectImage} alt={project.name} />
              <div className="mt-2 text-lg opacity-60">{project.desc}</div>
              <div className={`${project.onGithub || project.mobileImage ? "flex gap-4" : ""} mt-1 text-3xl`}>
                <a href={project.link}>
                  <span>{project.name}</span>
                </a>
                <a 
                  title="Github link"
                  className={`${project.onGithub ? "block" : "hidden"} flex items-center`}
                  href={project.onGithub}>
                  <img src="/social-links/github-iconx.svg" alt="github icon logo" />
                </a>
                <button
                  onClick={changeImage}
                  title="Change image"
                  className={`${project.mobileImage ? "block" : "hidden"} flex items-center`}
                >
                  <img src="/icons/mobile.svg" alt="mobile icon" />
                </button>
              </div>
              <div className="mt-2 opacity-80">
                <ul className="flex flex-wrap text-xs gap-2">
                  {project.techstack.map((tech, index) => (
                    <li key={index} className="border border-1 border-gray-400 px-2 py-1 rounded-xl hover:bg-gray-400 cursor-pointer">
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {project.collaborators && (
                <div className="flex gap-1 items-center mt-1 ml-2 opacity-80">
                  <span className='text-xs'>{txtInfo["with"]}</span>
                  <ul className="flex flex-wrap text-xs gap-2">
                    {project.collaborators.map((person, index) => (
                      <li key={index} className="py-2 cursor-pointer">
                        <a href={person.link} target="_blank">
                          {person.name}
                        </a>
                        {project.collaborators.length > 1 && index != project.collaborators.length - 1 ? "," : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
        </div>
    )
}