import React, { useRef } from 'react';
import "./Photography.css";
import SectionTab from '../../components/section_tab/SectionTab';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

const Photography: React.FC = () => {
  const divRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: divRef,
    offset: ["start start", "end start"]
  });
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 1], ["-120%", "0%", "0%"]),
    { stiffness: 200, damping: 30, mass: 2, bounce: 0 }
  )
  return (
    <>
      <div id="photography" ref={divRef} className="photography-container">

        {/* <SectionTab tabClass="photography-tab">Photography</SectionTab> */}

        <motion.div className="photography-content">
          Photography Content
        </motion.div>
      </div>
    </>
  )
}

export default Photography;