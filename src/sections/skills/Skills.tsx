import React, { useRef, useEffect, useState } from 'react';
import "./Skills.css"
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';

interface Skill {
  name: string;
  logo: string; // path to logo image or icon
}

const Skills: React.FC = () => {
  const divRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: divRef,
    offset: ["start end", "end start"]
  })

  // Alternating scroll directions - odd rows scroll left-to-right, even rows scroll right-to-left
  // Larger scroll distances to show more movement
  const row1X = useTransform(scrollYProgress, [0, 1], ["5%", "-80%"]);
  const row2X = useTransform(scrollYProgress, [0, 1], ["20%", "-80%"]);
  const row3X = useTransform(scrollYProgress, [0, 1], ["5%", "-70%"]);

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 0.01, 1], ["-120%", "0%", "0%"]),
    { bounce: 0, duration: 500 }
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0.8, 1], ["0", "-5vh"]),
    { bounce: 0, duration: 1000 }
  )

  // Sample skills data - replace with your actual skills
  const skillsRow1: Skill[] = [
    { name: "Python", logo: "/logos/python.svg" },
    { name: "C++", logo: "/logos/cpp.svg" },
    { name: "Go", logo: "/logos/golang.svg" },
    { name: "JavaScript", logo: "/logos/javascript.svg" },
    { name: "TypeScript", logo: "/logos/typescript.svg" },
    { name: "React", logo: "/logos/react.svg", },
    { name: "Svelte", logo: "/logos/svelte.svg" },
  ];

  const skillsRow2: Skill[] = [
    { name: "PyTorch", logo: "/logos/pytorch.svg" },
    { name: "TensorFlow", logo: "/logos/tensorflow.svg" },
    { name: "LangGraph", logo: "/logos/langgraph.svg" },
    { name: "LangChain", logo: "/logos/langchain.svg", },
  ];

  const skillsRow3: Skill[] = [
    { name: "PostgreSQL", logo: "/logos/postgres.svg" },
    { name: "MongoDB", logo: "/logos/mongodb.svg" },
    { name: "Apache Kafka", logo: "/logos/kafka.svg" },
    { name: "Docker", logo: "/logos/docker.svg" },
    { name: "Git", logo: "/logos/git.svg" },
    { name: "Bash", logo: "/logos/bash.svg" },
  ];

  // Create duplicated arrays
  const row1Cards = [...skillsRow1];
  const row2Cards = [...skillsRow2];
  const row3Cards = [...skillsRow3];

  const SkillCard = React.memo(({ skill }: { skill: Skill }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isLargeViewport, setIsLargeViewport] = useState(window.innerWidth >= 1025);

    useEffect(() => {
      const handleResize = () => setIsLargeViewport(window.innerWidth >= 1025);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const margin = isLargeViewport ? "0px -25% 0px -25%" : "0px -10% 0px -10%";
    const isInView = useInView(cardRef, { once: false, amount: 1, margin });
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (isInView) {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 600);
        return () => clearTimeout(timer);
      }
    }, [isInView]);

    return (
      <motion.div
        ref={cardRef}
        className={`skill-card ${isAnimating ? 'animating' : ''}`}
        style={{
          y: isInView ? 0 : 10,
          opacity: isInView ? 100 : 0
        }}
      >
        <img src={skill.logo} alt={skill.name} />
        <span className="skill-name">{skill.name}</span>
      </motion.div>
    );
  });

  return (
    <div id="skills" ref={divRef} className="skills-container">
      <motion.div className="skills-content"
        style={{
          left: translateX,
          translateY: translateY
        }}
      >
        <h2>My Technical Skills</h2>

        <motion.div className="skills-row odd-row" style={{ x: row1X }}>
          {row1Cards.map((skill, index) => (
            <SkillCard key={`row1-${index}`} skill={skill} />
          ))}
        </motion.div>

        <motion.div className="skills-row even-row" style={{ x: row2X }}>
          {row2Cards.map((skill, index) => (
            <SkillCard key={`row2-${index}`} skill={skill} />
          ))}

        </motion.div>
        <motion.div className="skills-row odd-row" style={{ x: row3X }}>
          {row3Cards.map((skill, index) => (
            <SkillCard key={`row3-${index}`} skill={skill} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Skills
