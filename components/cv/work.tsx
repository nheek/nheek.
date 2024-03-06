import getTextsMap from '../../components/get-texts-map';

export default function Work() {
  const wwwNheekNo = {
    txtWork: 'arbeid',
  };
  
  const wwwDefault = {
    txtWork: 'work',
  };
  
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  }

  let textsMap = getTextsMap(domainPairs);

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
        "inspire innovation and curiosity by designing imaginative coding projects that unleash the creative potential of young programmers"
      ]
    },
  ]
  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
        <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
          {textsMap.txtWork}
        </hgroup>
        {
          workList.map((work, index) => (
            <div
              className="mb-14" 
              key={index}
            >
              <div className="flex flex-wrap items-center gap-4 text-2xl w-[90%] mt-8 mb-2 m-auto">
                  <h2 className="">{work.title}</h2>
                  <i className="w-1 h-1 bg-white my-auto rounded-full opacity-50"></i>
                  <a
                    className="text-lg opacity-50"
                    href={work.companyLink}>
                    <span>{work.companyName}</span>
                  </a>
                  <i className="w-1 h-1 bg-white my-auto rounded-full opacity-50"></i>
                  <span className="text-lg opacity-50">{`${work.startDate} - ${work.endDate}`}</span>
              </div>
              <div className="text-lg w-[90%] mt-4 pl-8 m-auto">
                <ul className="list-disc">
                  {
                    work.tasks.map((task, index) => (
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