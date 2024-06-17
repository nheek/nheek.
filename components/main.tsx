import dynamic from 'next/dynamic';
import Hero from './HeroC';
import SocialLinks from '../components/social-links';
const Navigate = dynamic(() => import("../components/navigate"));
const FooterHero = dynamic(() => import("./FooterHero"));
const Skills = dynamic(() => import("../components/skills"));
const FeaturedProjects = dynamic(() => import("./FeaturedProjects"));

export default function Main({isFullStack}) {
  return (
    <main>
      <Hero isFullStack={isFullStack}/>
      <SocialLinks />
      <Navigate />
      <FeaturedProjects isFullStack={isFullStack} />
      <Skills />
      <FooterHero />
    </main>
  );
}