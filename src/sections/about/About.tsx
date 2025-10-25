import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import "./About.css";

const About: React.FC = () => {
    const divRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: divRef,
        offset: ["start end", "center center"]
    })
    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 0.3, 1], ["-120%", "0%", "0%"]),
        { bounce: 0 }
    )
    const translateY = useSpring(
        useTransform(scrollYProgress, [0.8, 1], ["0", "-5vh"]),
        { stiffness: 200, damping: 30, mass: 2 }
    )
    return (
        <div id="about" ref={divRef} className="about-container">
            <motion.div className="about-content"
                style={{
                    left: translateX,
                    translateY: translateY
                }}
            >
                <div>

                    <h2>Hello there!</h2>
                    <p>
                        I'm a recent Computer Science graduate from the University of California, Irvine.
                    </p>

                    <p>
                        I'm a serial hobbyist and self-learner; I've taught myself photography, barbering (for others and myself).
                    </p>
                    <p>
                        I'm also keen as an educator in math and programming :)
                    </p>
                </div>

                <img src="./portrait.jpg" />
            </motion.div>
        </div>
    )
}

export default About