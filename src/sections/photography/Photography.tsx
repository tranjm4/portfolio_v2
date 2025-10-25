import React from 'react';
import "./Photography.css";
import { motion } from 'framer-motion';

const Photography: React.FC = () => {
  return (
    <>
      <div id="photography" className="photography-container">

        {/* <SectionTab tabClass="photography-tab">Photography</SectionTab> */}

        <motion.div className="photography-content">
          Photography Content
        </motion.div>
      </div>
    </>
  )
}

export default Photography;