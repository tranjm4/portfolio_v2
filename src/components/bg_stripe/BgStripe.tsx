import React from 'react';
import "./BgStripe.css";
import { motion, useScroll, useTransform } from 'motion/react';

const BgStripe: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
    const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '10vh']);
    const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '20vh']);
    return (
        <>
            <motion.div
                className="stripe1"
                style={{ y: y1 }}
            />
            <motion.div
                className="stripe2"
                style={{ y: y2, originX: 0 }}
            // animate={{
            //     scaleX: [1, 0, 0, 1],
            // }}
            // transition={{
            //     duration: 15,
            //     repeat: Infinity,
            //     ease: "easeInOut"
            // }}
            />
            <motion.div
                className="stripe3"
                style={{ y: y3 }}
                animate={{
                    scaleX: [0.6, 1, 0.7, 0.8, 0.6]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="stripe3"
                style={{ y: y3, translateY: "30px", translateX: "90px" }}
                animate={{
                    scaleX: [0.7, 1, 0.8, 0.6, 0.7]
                }}
                transition={{
                    duration: 17.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="stripe3"
                style={{ y: y3, translateY: "-30px", translateX: "150px" }}
                animate={{
                    scaleX: [0.7, 1, 1, 0.8, 0.7]
                }}
                transition={{
                    duration: 12.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </>
    );
};

export default BgStripe;