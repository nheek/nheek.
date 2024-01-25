import Hero from '../components/hero';
import SocialLinks from '../components/social-links';
import FeaturedProjects from '../components/featured-projects';
import FooterHero from '../components/footer-hero';

export default function Main() {
  return (
    <main>
      <Hero />
      <SocialLinks />
      <FeaturedProjects />
      <FooterHero />
    </main>
  );
}