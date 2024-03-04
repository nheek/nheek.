import Hero from '../components/hero';
import SocialLinks from '../components/social-links';
import FeaturedProjects from '../components/featured-projects';
import FooterHero from '../components/footer-hero';
import Skills from '../components/skills';

export default function Main({isFullStack}) {
  return (
    <main>
      <Hero isFullStack={isFullStack}/>
      <SocialLinks />
      <FeaturedProjects isFullStack={isFullStack} />
      <Skills />
      <FooterHero />
    </main>
  );
}