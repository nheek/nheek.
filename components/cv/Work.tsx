import getTextsMap from "../GetTextsMap";

export default function Work() {
  const wwwNheekNo = {
    txtWork: "arbeid",
  };

  const wwwDefault = {
    txtWork: "work",
  };

  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };

  const textsMap = getTextsMap(domainPairs);

  const workList = [
    {
      title: "programming teacher",
      companyName: "youngcoderz",
      companyLink: "https://www.youngcoderz.com/",
      startDate: "sept 2022",
      endDate: "present",
      tasks: [
        "expertly articulate complex coding concepts to engage and educate young minds effectively",
        "tailor curriculum and teaching methods to meet the diverse needs and learning styles of children aged 8 to 14",
        "foster a supportive learning environment by patiently guiding students through challenges with empathy and understanding",
        "inspire innovation and curiosity by designing imaginative coding projects that unleash the creative potential of young programmers",
      ],
    },
  ];
  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
        {textsMap.txtWork}
      </hgroup>
      {workList.map((work, index) => (
        <div className="mb-14" key={"work-" + index}>
          <div className="flex flex-col md:flex-row flex-wrap md:items-center text-2xl w-full md:w-[90%] mt-8 m-auto">
            <h2 className="">{work.title}</h2>
            <div className="flex gap-4 ml-4">
              <i className="w-1 h-1 bg-white my-auto rounded-full opacity-50"></i>
              <a className="text-lg opacity-50" href={work.companyLink}>
                <span>{work.companyName}</span>
              </a>
            </div>
            <div className="flex gap-4 ml-4">
              <i className="w-1 h-1 bg-white my-auto rounded-full opacity-50"></i>
              <span className="text-lg opacity-50">{`${work.startDate} - ${work.endDate}`}</span>
            </div>
          </div>
          <div className="text-lg w-full md:w-[90%] mt-4 md:pl-8 m-auto">
            <ul className="flex flex-col gap-4">
              {work.tasks.map((task, index) => (
                <li
                  className="shadow-inner-blue inset-y-0 inset-x-0 p-4 rounded-3xl"
                  key={"work-task-" + index}
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
