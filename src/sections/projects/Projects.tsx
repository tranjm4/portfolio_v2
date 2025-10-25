import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import "./Projects.css";

interface ProjectEntry {
  name: string;
  description: string;
  url: string;
  image_path: string;
  website?: string;
}


const Projects: React.FC = () => {
  const scrollRef = useRef(null);
  const divRef = useRef(null);

  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: divRef,
    offset: ["start end", "center center"]
  });

  const { scrollYProgress: carouselScrollProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const translateX = useSpring(
    useTransform(headerScrollProgress, [0, 0.3, 1], ["120%", "0%", "0%"]),
    { bounce: 0, duration: 300 }
  );

  const translateY = useSpring(
    useTransform(carouselScrollProgress, [0.5, 0.7], ["0", "-5vh"]),
    { stiffness: 200, damping: 30, mass: 2 }
  )

  const entries: ProjectEntry[] = [
    {
      name: "YouTube Bot Anomaly Detection",
      description: "An unsupervised learning model leveraging isolation forests to detect bot accounts through commenting patterns",
      url: "https://ytbotdetector.streamlit.app",
      image_path: ""
    },
    {
      name: "Research Assistant Agent",
      description: "A chatbot designed to help academics brainstorm ideas and accelerate research",
      url: "https://github.com/tranjm4/research_agent",
      image_path: ""
    },
    {
      name: "NYC Traffic Risk Forecaster",
      description: "A Bayesian inference model that uses weather data and location to forecast risk of accidents in NYC",
      url: "https://github.com/tranjm4/nyc_weather_risk_forecaster",
      image_path: ""
    },
  ];

  const [endPosition, setEndPosition] = useState("-100%");

  useEffect(() => {
    const updateEndPosition = () => {
      setEndPosition(window.innerWidth >= 768 ? "-65%" : "-120%");
    };

    updateEndPosition();
    window.addEventListener('resize', updateEndPosition);
    return () => window.removeEventListener('resize', updateEndPosition);
  }, []);

  const carouselX = useTransform(carouselScrollProgress, [0, 1], [window.innerWidth >= 768 ? "20%" : "0%", endPosition]);

  // Calculate scroll height to exactly match carousel movement
  const scrollHeight = `${(entries.length - 1) * 100}vh`;

  return (
    <div id="projects" className="projects-container">
      <div ref={divRef} className="projects-header">
      </div>

      <div
        ref={scrollRef}
        className="project-carousel-scroll-container"
        style={{ height: scrollHeight }}
      ></div>

      <motion.div className="projects-content"
        style={{
          translateX: translateX,
          translateY: translateY
        }}
      >
        <h2>
          Projects
        </h2>

        <div className="project-carousel-container">
          <motion.div className="project-carousel-track" style={{ x: carouselX }}>
            {entries.map((entry: ProjectEntry, index: number) => (
              <div key={index} className="project-carousel-entry">
                <h3>{entry.name}</h3>
                <p>{entry.description}</p>
                {/* <img src={entry.image_path} alt={entry.name} /> */}
                <a href={entry.url} target="_blank" rel="noopener">
                  <span>Github Repo</span>
                </a>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Projects