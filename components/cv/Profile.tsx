import getTextsMap from "../utils/GetTextsMap";

export default function Profile() {
  const wwwNheekNo = {
    txtProfile: "profil",
  };

  const wwwDefault = {
    txtProfile: "profile",
  };

  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };

  const textsMap = getTextsMap(domainPairs);

  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
        {textsMap.txtProfile}
      </hgroup>
      <div className="flex flex-wrap gap-4 text-lg w-[90%] mt-8 m-auto leading-8">
        <p>
          {`I've been passionate about coding and programming since I was younger.
          It all started when I tried making my first website with Strikingly, a
          website builder with blogs functionality. Then moved on to Blogger,
          then to WordPress.com, then to WordPress.org where I first probably
          saw actual codes.`}
        </p>
        <p>
          Fast forward to now. A fullstack developer whose range of techstack is
          very wide but still focuses on being adept and efficient with all of
          them. Learning new technologies has become one of my hobbies. And
          applying them and making them into live projects come as a bonus.
        </p>
      </div>
    </section>
  );
}
