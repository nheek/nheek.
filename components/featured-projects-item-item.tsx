import { useState, useEffect } from 'react';
import ImageLoader from './utils/image-loader';

export default function FeaturedProjectsItemItem ({category = null, project = null, txtInfo = null}) {
    const [projectImage, setProjectImage] = useState(project.image);
    const [websiteStatus, setWebsiteStatus] = useState(null);
    const [mobileAppImageIndex, setMobileAppImageIndex] = useState(0);
    
    useEffect(() => {
        // Update the projectImage state when project.image changes
        setProjectImage(project.image);
    }, [project.image]);

    useEffect(() => {
        if (project.link) {
            checkWebsiteStatus(project.link);
        }
    }, [project.link]);

    const changeImage = () => {
        let imageToSet = projectImage === project.image ? project.mobileImage : project.image;
        setProjectImage(imageToSet);
    };

    const checkWebsiteStatus = async (url) => {
        try {
            const response = await fetch(`/api/website-status?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            setWebsiteStatus(data.status === "up");
        } catch (error) {
            console.error('Error checking website status:', error);
            setWebsiteStatus(false);
        }
    };

    /* For handling  mobile apps images */
    const handlePreviousImage = () => {
        if (mobileAppImageIndex > 0) {
            setMobileAppImageIndex(mobileAppImageIndex - 1);
        }
    };

    /* For handling  mobile apps images */
    const handleNextImage = () => {
        if (mobileAppImageIndex < projectImage.length - 1) {
            setMobileAppImageIndex(mobileAppImageIndex + 1);
        }
    };

    return (
        <div className="w-full md:w-[40%] md:h-[500px] mt-16">
            <div className="relative">
                <ImageLoader
                    src={category == 'mobileApps' ? projectImage[mobileAppImageIndex] : projectImage}
                    alt={project.name}
                    className="max-h-[400px] rounded-xl shadow-lg mx-auto"
                />
                {category == 'mobileApps' && projectImage.length > 1 &&
                    <>
                        <button
                            onClick={handlePreviousImage}
                            className="absolute top-1/2 transform -translate-y-1/2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8l-4 4 4 4M16 12H9" /></svg>
                        </button><button
                            onClick={handleNextImage}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2"
                        >
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8l4 4-4 4M8 12h7" /></svg>
                        </button>
                    </>
                }
                {
                    project.bug && 
                    <>
                        <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-t-[75px] border-r-[75px] border-transparent border-r-red-200"></div>
                        <div className="absolute z-20 bottom-1 right-1 text-lg text-black">Bug</div>
                    </>
                }
            </div>
            <div className="mt-2 text-lg opacity-60">{project.desc}</div>
            <div className={`${project.onGithub || project.mobileImage || websiteStatus != null ? "flex gap-4" : ""} mt-1 text-3xl`}>
                <a href={project.link}>
                    <span>{project.name}</span>
                </a>
                { !["desktopApps", "mobileApps"].includes(category)  &&
                  <div className={`h-2 w-2 rounded-full my-auto animate-pulse ${websiteStatus === true ? "bg-green-400" : "bg-red-400"}`}></div>
                }
                <a 
                    title="Github link"
                    className={`${project.onGithub ? "block" : "hidden"} flex items-center`}
                    href={project.onGithub}
                >
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
                        <li key={index} className="border border-1 border-gray-400 px-2 py-1 rounded-xl hover:bg-gray-400">
                            <span>{tech}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {
                project.deployedWith && (
                    <div className="flex gap-1 items-center mt-2 ml-1 opacity-80">
                        <span className="text-xs">{txtInfo["deployedWith"]}</span>
                        <ul className="flex flex-wrap text-xs gap-2">
                        {
                            project.deployedWith.map((deploy, index) => (
                                <li key={index}>
                                    {deploy}
                                    {project.deployedWith.length > 1 && index !== project.deployedWith.length - 1 ? "," : ""}
                                </li>
                                
                            ))
                        }
                        </ul>
                    </div>
                )
            }
            {project.collaborators && (
                <div className="flex gap-1 items-center mt-1 ml-2 opacity-80">
                    <span className='text-xs'>{txtInfo["with"]}</span>
                    <ul className="flex flex-wrap text-xs gap-2">
                        {project.collaborators.map((person, index) => (
                            <li key={index} className="py-2 cursor-pointer">
                                <a href={person.link} target="_blank">
                                    {person.name}
                                </a>
                                {project.collaborators.length > 1 && index !== project.collaborators.length - 1 ? "," : ""}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
