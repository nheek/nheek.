import IsTwoWeeksApart from "./utils/IsTwoWeeksApart";

export default function FeaturedProjectsItemItem({
  id = null,
  project = null,
}) {
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
            src={project.image}
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
          isOdd(id) ? "md:items-start" : "md:items-end"
        } flex flex-col items-center md:mt-1 text-3xl`}
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
              <span className="text-xs">{"with"}</span>
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
      </div>
    </div>
  );
}
