import Hero from '../components/hero';
import SocialLinks from '../components/social-links';
import FeaturedProjects from '../components/featured-projects';
import FooterHero from '../components/footer-hero';
import Skills from '../components/skills';
import Navigate from '../components/navigate';

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