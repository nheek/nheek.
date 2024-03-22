import dynamic from 'next/dynamic';
import Hero from '../components/hero';
import SocialLinks from '../components/social-links';
import FooterHero from '../components/footer-hero';
import Skills from '../components/skills';
import Navigate from '../components/navigate';
const FeaturedProjects = dynamic(() => import('../components/featured-projects'));

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