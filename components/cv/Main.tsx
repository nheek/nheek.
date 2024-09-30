import dynamic from "next/dynamic";
import Profile from "./Profile";
const Volunteer = dynamic(() => import("./Volunteer"));
const Work = dynamic(() => import("./Work"));

export default function Main() {
  return (
    <main>
      <Profile />
      <Work />
      <Volunteer />
    </main>
  );
}
