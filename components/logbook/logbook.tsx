// import { useState, useEffect } from "react";
import getTextsMap from "../utils/GetTextsMap";
// import { Stage, Layer, Line } from "react-konva";
import DrawingPad from "./drawing-pad";

export default function Logbook() {
  const wwwNheekNo = {
    txtFootprint: "fotspor",
    txtFootprintSubtxt: "tegn din beste kunst og bli utvalgt nede!",
  };

  const wwwDefault = {
    txtFootprint: "footprint",
    txtFootprintSubtxt: "draw your best art and be featured below!",
  };

  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };

  const textsMap = getTextsMap(domainPairs);

  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
        {textsMap.txtFootprint}
      </hgroup>
      <span className="block text-lg w-[90%] mt-8 m-auto leading-8">
        {textsMap.txtFootprintSubtxt}
      </span>
      <div className="text-lg w-full mt-8 m-auto border-2 border-opacity-50">
        <DrawingPad />
      </div>
    </section>
  );
}
