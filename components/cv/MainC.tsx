import dynamic from "next/dynamic";
import Profile from "./ProfileC";
const Volunteer = dynamic(() => import("./VolunteerC"));
const Work = dynamic(() => import("./WorkC"));

export default function Main() {
  return (
    <main>
        <Profile />
        <Work />
        <Volunteer />
    </main>
  );
}