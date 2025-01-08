import Navigate from "./Navigate";
import getTextsMap from "./utils/GetTextsMap";

export default function FooterHero() {

  return (
    <>
      <div className="mt-36 text-center">
        <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center">
          piqued your interest?
        </h2>
        <span className="block mt-4 text-xl">there's more...</span>
      </div>
      {/* <Navigate /> */}
      {/* <a
        className="w-[90%] md:w-1/4 block bg-slate-400 mx-auto text-center text-xl brightness-125 hover:brightness-[unset] hover:-rotate-6 mt-10 md:mt-4 px-4 py-3 rounded-3xl hover:bg-gray-200 hover:text-blue-950 duration-500 !no-underline"
        href="mailto:nickjameshipol@gmail.com"
        target="_blank"
      >
        Send email
      </a> */}
    </>
  );
}
