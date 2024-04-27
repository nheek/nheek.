import dynamic from "next/dynamic";
import Profile from "./profile";
const Volunteer = dynamic(() => import("./volunteer"));
const Work = dynamic(() => import("./work"));

export default function Main() {
  return (
    <main>
        <Profile />
        <Work />
        <Volunteer />
    </main>
  );
}