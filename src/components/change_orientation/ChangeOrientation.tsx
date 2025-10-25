import React from 'react';
import "./ChangeOrientation.css";
import { motion } from 'motion/react';

const ChangeOrientation: React.FC = () => {
    return (
        <div className="change-orientation-container">
            <motion.div className="change-orientation-animation"
                animate={{
                    rotate: ["0deg", "0deg", "90deg", "90deg", "0deg"],
                    opacity: [0, 1, 1, 0, 0]
                }}
                transition={{
                    ease: "easeInOut",
                    repeat: Infinity,
                    duration: 2
                }}

            />
        </div>
    )
}

export default ChangeOrientation