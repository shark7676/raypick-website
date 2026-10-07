import HeroStage from '../components/HeroStage';
import AppShowcase from '../components/AppShowcase';
import Upcoming from '../components/Upcoming';
import About from '../components/About';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <main>
      <HeroStage />
      <AppShowcase />
      <Upcoming />
      <About />
      <Contact />
    </main>
  );
}
