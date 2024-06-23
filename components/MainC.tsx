import dynamic from 'next/dynamic';
import Hero from './Hero';
import SocialLinks from './SocialLinks';
const Navigate = dynamic(() => import("./NavigateC"));
const FooterHero = dynamic(() => import("./FooterHero"));
const Skills = dynamic(() => import("./skills"));
const FeaturedProjects = dynamic(() => import("./FeaturedProjects"));

export default function Main() {
  return (
    <main>
      <Hero />
      <SocialLinks />
      <Navigate />
      <FeaturedProjects />
      <Skills />
      <FooterHero />
    </main>
  );
}