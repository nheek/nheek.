import getTextsMap from "../GetTextsMap";

export default function Volunteer() {
  const wwwNheekNo = {
    txtVolunteer: "frivillig",
  };

  const wwwDefault = {
    txtVolunteer: "volunteer",
  };

  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };

  const textsMap = getTextsMap(domainPairs);

  const volunteerList = [
    {
      title: "frontend developer",
      companyName: "studvest",
      companyLink: "https://www.studvest.no/",
      startDate: "jan 2024",
      endDate: "present",
      tasks: [
        "implement responsive design principles to ensure optimal user experience across various devices, enhancing accessibility and engagement",
        "enhance user interface and experience through intuitive design choices and seamless navigation, prioritising reader satisfaction",
        "collaborate with editorial and design teams to integrate frontend solutions seamlessly with content and visual elements, ensuring cohesive storytelling",
        "employ best practices to optimise frontend performance, including code efficiency and loading speed, to enhance site usability and reader retention",
      ],
    },
    {
      title: "chairman of the board",
      companyName: "root linjeforening",
      companyLink: "https://www.rootlinjeforening.no/",
      startDate: "jan 2024",
      endDate: "present",
      tasks: [
        "strategic planning and oversight to drive the department's growth and align its objectives with the school's mission",
        "effective resource allocation, including managing budgets and staffing, ensures the department has the necessary tools and personnel to maintain its competitiveness and support its initiatives",
        "promoting a culture of excellence and innovation empowers faculty and staff to pursue professional development, explore new technologies, and contribute to the department's reputation and the school's overall success",
        "lead with vision and diligence, ensuring that every decision made serves the department's mission and advances its position within the school community",
      ],
    },
    {
      title: "member",
      companyName: "fribyte",
      companyLink: "https://fribyte.no/",
      startDate: "jan 2024",
      endDate: "present",
      tasks: [
        "deliver essential it services to diverse organisations, including hosting and web development solutions",
        "efficiently allocate resources to ensure organisations receive tailored it solutions, enhancing their technological capabilities and operational efficiency",
        "drive excellence and innovation within the it group, empowering volunteers to leverage cutting-edge technologies and strategies to deliver impactful solutions",
        "facilitate clear communication and understanding of diverse it requirements, promoting collaboration and a supportive atmosphere among programmers to drive innovation and success",
      ],
    },
    {
      title: "member",
      companyName: "kvarteret it group",
      companyLink: "https://kvarteret.no/",
      startDate: "feb 2024",
      endDate: "present",
      tasks: [
        "manage and maintain all it operations within kvarteret, including networking, system administration, and troubleshooting, to ensure seamless functionality.",
        "implement and oversee it projects, such as website development and digital marketing initiatives, to enhance kvarteret's online presence and engagement.",
        "provide technical support and training to staff and patrons, ensuring smooth utilization of it resources and maximising user experience.",
        "collaborate with the it team to foster innovation and efficiency, actively seeking out emerging technologies and contributing to the implementation of strategic approaches to enhance and evolve it services within kvarteret.",
      ],
    },
  ];
  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
        {textsMap.txtVolunteer}
      </hgroup>
      {volunteerList.map((volunteer, index) => (
        <div className="mb-14" key={index}>
          <div className="flex flex-col md:flex-row flex-wrap md:items-center text-2xl w-full md:w-[90%] mt-8 m-auto">
            <h2 className="">{volunteer.title}</h2>
            <div className="flex gap-4 ml-4">
              <i className="w-1 h-1 bg-white my-auto rounded-full opacity-50"></i>
              <a className="text-lg opacity-50" href={volunteer.companyLink}>
                <span>{volunteer.companyName}</span>
              </a>
            </div>
            <div className="flex gap-4 ml-4">
              <i className="w-1 h-1 bg-white my-auto rounded-full opacity-50"></i>
              <span className="text-lg opacity-50">{`${volunteer.startDate} - ${volunteer.endDate}`}</span>
            </div>
          </div>
          <div className="text-lg w-full md:w-[90%] mt-4 md:pl-8 m-auto">
            <ul className="flex flex-col gap-4">
              {volunteer.tasks.map((task, index) => (
                <li
                  className="shadow-inner-blue inset-y-0 inset-x-0 p-4 rounded-3xl"
                  key={"volunteer-task-" + index}
                >
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}
