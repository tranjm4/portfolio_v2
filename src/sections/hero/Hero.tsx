import React, { useState, useEffect, useRef } from 'react';
import "./Hero.css";
import TypeWriter from 'typewriter-effect';
import { motion, useSpring, useTransform, useScroll } from "motion/react";

const Hero: React.FC = () => {
  const [showH2, setShowH2] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["end end", "end start"]
  })

  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.4, 0.6, 1], ["0vh", "0vh", "-45vh", "-45vh"]),
    { bounce: 0 }
  )

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 0.6, 1], ["100%", "100%", "70%", "70%"]),
    { stiffness: 100, bounce: 0, damping: 30 }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowH2(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="hero-container">
      <motion.div ref={scrollRef} className="hero-text-container"
        style={isDesktop ? {
          translateY: translateY,
          scale: scale
        } : {}}
        transition={isDesktop ? {
          type: "tween",
          ease: "easeOut",
          duration: 0.3
        } : {}}
      >

        <h1>
          <TypeWriter
            onInit={(typewriter) => {
              typewriter.typeString("Jonathan Tran")
                .pauseFor(1000)
                .callFunction(() => {
                  const h1Element = document.querySelector('h1');
                  const cursor = h1Element?.querySelector('.Typewriter__cursor');
                  if (cursor) cursor.remove();
                })
                .start()
            }}
          />
        </h1>
        <h2 className={!showH2 ? 'hidden' : ''}>
          <TypeWriter
            options={{
              strings: ["Software Developer", "AI/ML Engineer", "Photography Lover", "Coffee Connoisseur"],
              autoStart: showH2,
              loop: true,
              delay: 100,
              deleteSpeed: 20,
            }}
          />
        </h2>
      </motion.div>
    </div>
  )
}

export default Hero