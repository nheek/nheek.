import React, { useState, useEffect } from "react";
// import ImageLoader from "./utils/ImageLoader";
import IsTwoWeeksApart from "./utils/IsTwoWeeksApart";

export default function FeaturedProjectsItemItem({
  id = null,
  category = null,
  project = null,
  txtInfo = null,
}) {
  const [projectImage, setProjectImage] = useState(project.image);
  const [websiteStatus, setWebsiteStatus] = useState(null);
  const [mobileAppImageIndex, setMobileAppImageIndex] = useState(0);

  useEffect(() => {
    setProjectImage(project.image);
  }, [project.image]);

  useEffect(() => {
    if (project.link) {
      checkWebsiteStatus(project.link);
    }
  }, [project.link]);

  // const changeImage = () => {
  //   const imageToSet =
  //     projectImage === project.image ? project.mobileImage : project.image;
  //   setProjectImage(imageToSet);
  // };
  const checkWebsiteStatus = async (url: string) => {
    try {
      const response = await fetch(
        `/api/website-status?url=${encodeURIComponent(url)}`,
      );
      const data = await response.json();
      setWebsiteStatus(data.status === "up");
    } catch (error) {
      console.error("Error checking website status:", error);
      setWebsiteStatus(false);
    }
  };

  /* for handling  mobile apps images */
  const handlePreviousImage = () => {
    if (mobileAppImageIndex > 0) {
      setMobileAppImageIndex(mobileAppImageIndex - 1);
    }
  };

  /* for handling  mobile apps images */
  const handleNextImage = () => {
    if (mobileAppImageIndex < projectImage.length - 1) {
      setMobileAppImageIndex(mobileAppImageIndex + 1);
    }
  };

  const isOdd = (number) => {
    return number % 2 !== 0;
  };

  return (
    <div
      className={`${isOdd(id) ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse"} flex items-center gap-4 w-full md:w-[90%] max-h-max md:max-h-[400px] mt-8 md:-mt-5 hover:scale-110 duration-300`}
    >
      <div className="md:w-[55%] relative">
        <a href={project.link} target="_blank">
          <img
            src={
              category == "mobileApps"
                ? projectImage[mobileAppImageIndex]
                : projectImage
            }
            alt={project.name}
            className="!rounded-xl shadow-2xl mx-auto"
          />
        </a>

        {
          /* The "new" banner */
          !IsTwoWeeksApart(project.dateAdded) && (
            <div
              title="deployed within the past 14 days"
              className={`${isOdd(id) ? "left-1/2 md:-left-5 md:-rotate-12" : "right-1/2 md:-right-5 md:rotate-12"} absolute -top-5 md:left-[unset] transform -translate-x-1/2 md:-translate-x-0 bg-green-600 text-gray-50 rounded-full px-2 py-3 text-lg`}
            >
              new {IsTwoWeeksApart(project.dateAdded)}
            </div>
          )
        }
        {category == "mobile" && projectImage.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              className="absolute top-1/2 transform -translate-y-1/2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8l-4 4 4 4M16 12H9" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-0 transform -translate-y-1/2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8l4 4-4 4M8 12h7" />
              </svg>
            </button>
          </>
        )}
        {
          /* currently unused, shows a badge for when a website has a bug */
          project.bug && (
            <>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-t-[75px] border-r-[75px] border-transparent border-r-red-200"></div>
              <div className="absolute z-20 bottom-1 right-1 text-lg text-black">
                Bug
              </div>
            </>
          )
        }
        {
          /* shows a banner for website status, for example "under maintenance" */
          project.status && (
            <div className="absolute bottom-0 right-0 w-full bg-yellow-950 bg-opacity-50 px-4 py-2 text-xl text-white text-center rounded-b-xl">
              {project.status}
            </div>
          )
        }
      </div>
      <div
        className={`${
          project.onGithub || project.mobileImage || websiteStatus != null
            ? `flex flex-col ${isOdd(id) ? "md:items-start" : "md:items-end"}`
            : ""
        } items-center md:mt-1 text-3xl`}
      >
        <div
          className={`${isOdd(id) ? "md:text-left" : "md:text-right"} text-center w-full md:w-[80%] -mt-2 md:mt-2 text-base opacity-60`}
        >
          {project.desc}
        </div>
        {project.link && (
          <a href={project.link} target="_blank">
            <span className="flex text-2xl">{project.name}</span>
          </a>
        )}
        {!project.link && <span className="flex text-2xl">{project.name}</span>}

        {
          /* shows the project collaborators */
          project.collaborators && (
            <div className={`flex gap-1 items-center opacity-80`}>
              <span className="text-xs">{txtInfo["with"]}</span>
              <ul className="flex flex-wrap text-xs gap-2">
                {project.collaborators.map((person, index) => (
                  <li
                    key={"collaborators" + index}
                    className="py-2 cursor-pointer"
                  >
                    <a href={person.link} target="_blank">
                      {person.name}
                    </a>
                    {project.collaborators.length > 1 &&
                    index !== project.collaborators.length - 1
                      ? ","
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        {/* {!["desktop", "mobile"].includes(category) && project.link && (
          <div
            className={`h-2 w-2 rounded-full my-auto animate-pulse ${websiteStatus === true ? "bg-green-400" : "bg-red-400"}`}
          ></div>
        )} */}
        {/* <a
          title="Github link"
          className={`${project.onGithub ? "block" : "hidden"} flex items-center h-6 w-6`}
          href={project.onGithub}
          target="_blank"
        >
          <img src="/social-links/github.svg" alt="github icon" />
        </a> */}
        {/* <a
          title="Grit link"
          className={`${project.onGrit ? "block" : "hidden"} flex items-center`}
          href={project.onGrit}
          target="_blank"
        >
          <img src="/icons/grit.svg" alt="grit icon logo" />
        </a> */}
        {/* <button
          onClick={changeImage}
          title="Change image"
          className={`${project.mobileImage ? "block" : "hidden"} flex items-center`}
        >
          <img src="/icons/mobile.svg" alt="mobile icon" />
        </button> */}
      </div>
      {/* <div className="mt-2 opacity-80">
        <ul className="flex flex-wrap text-xs gap-2">
          {project.techstack.map((tech, index) => (
            <li key={"techstack" + index} className="pr-2 py-1">
              <span>{tech}</span>
            </li>
          ))}
        </ul>
      </div> */}
      {
        /* shows the text "deployed with" under the images */
        // project.deployedWith && (
        //   <div className="flex gap-1 items-center mt-2 opacity-80">
        //     <span className="text-xs">{txtInfo["deployedWith"]}</span>
        //     <ul className="flex flex-wrap text-xs gap-2">
        //       {project.deployedWith.map((deploy, index) => (
        //         <li key={"deployed-with" + index}>
        //           {deploy}
        //           {project.deployedWith.length > 1 &&
        //           index !== project.deployedWith.length - 1
        //             ? ","
        //             : ""}
        //         </li>
        //       ))}
        //     </ul>
        //   </div>
        // )
      }
    </div>
  );
}
