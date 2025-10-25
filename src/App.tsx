
import Hero from "./sections/hero/Hero";
import About from "./sections/about/About";
import Projects from "./sections/projects/Projects";
import Skills from "./sections/skills/Skills";

import "./App.css";
import BgStripe from "./components/bg_stripe/BgStripe";
import InteractiveGrid from "./components/interactive_grid/InteractiveGrid";
import { useEffect, useState } from "react";

import ChangeOrientation from "./components/change_orientation/ChangeOrientation"
import SectionTab from "./components/section_tab/SectionTab";
import Contact from "./sections/contact/Contact";

const Content: React.FC = () => {
  return (
    <>
      {/* Interactive grid */}
      <InteractiveGrid />

      <SectionTab />

      {/* Vertical navbar here */}
      <BgStripe />
      <div className="content-wrapper">

        <Hero />

        <About />

        <Projects />

        <Skills />

      </div>
      <Contact />
    </>
  )
}

function App() {
  const checkLandscape = () => {
    const isMobileSize = window.innerWidth < 400 || window.innerHeight < 400;
    const isPortraitDimensions = window.innerHeight > window.innerWidth;

    if (isMobileSize && !isPortraitDimensions) {
      return screen.orientation.type.startsWith('landscape');
    }
    else {
      return false;
    }
  }

  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(checkLandscape());
    };

    // Check on mount
    setIsLandscape(checkLandscape());

    screen.orientation.addEventListener('change', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // unmount
    return () => {
      screen.orientation.removeEventListener('change', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    }
  }, [])

  return (
    <>
      {!isLandscape ?
        <Content />
        :
        <ChangeOrientation />
      }
    </>
  )
}

export default App;
