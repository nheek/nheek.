import getTextsMap from '../../components/get-texts-map';

export default function Volunteer() {
  const wwwNheekNo = {
    txtVolunteer: 'frivillig',
  };
  
  const wwwDefault = {
    txtVolunteer: 'volunteer',
  };
  
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  }

  let textsMap = getTextsMap(domainPairs);

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
        "employ best practices to optimise frontend performance, including code efficiency and loading speed, to enhance site usability and reader retention"
      ]
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
        "lead with vision and diligence, ensuring that every decision made serves the department's mission and advances its position within the school community"
      ]
    },
    {
      title: "member",
      companyName: "fribyte",
      companyLink: "https://fribyte.no/",
      startDate: "jan 2024",
      endDate: "present",
      tasks: [
      ]
    },
    {
      title: "member",
      companyName: "kvarteret it group",
      companyLink: "https://kvarteret.no/",
      startDate: "feb 2024",
      endDate: "present",
      tasks: [
      ]
    },
  ]
  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
        <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
          {textsMap.txtVolunteer}
        </hgroup>
        {
          volunteerList.map((volunteer, index) => (
            <div
              className="mb-14" 
              key={index}
            >
              <div className="flex flex-wrap items-center gap-4 text-2xl w-[90%] mt-8 m-auto">
                  <h2 className="">{volunteer.title}</h2>
                  <i className="w-1 h-1 bg-white my-auto rounded-full opacity-50"></i>
                  <a
                    className="text-lg opacity-50"
                    href={volunteer.companyLink}>
                    <span>{volunteer.companyName}</span>
                  </a>
                  <i className="w-1 h-1 bg-white my-auto rounded-full opacity-50"></i>
                  <span className="text-lg opacity-50">{`${volunteer.startDate} - ${volunteer.endDate}`}</span>
              </div>
              <div className="text-lg w-[90%] mt-4 pl-8 m-auto">
                <ul className="list-disc">
                  {
                    volunteer.tasks.map((task, index) => (
                      <li
                        className="pb-4"
                        key={index}
                      >
                        {task}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          ))
        }
    </section>
  );
}