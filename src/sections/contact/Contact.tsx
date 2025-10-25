import React, { useRef } from 'react';
import "./Contact.css";
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';

interface ContactEntry {
    name: string;
    img: string;
    url: string;
}

const Contact: React.FC = () => {
    const divRef = useRef(null);
    const headerRef = useRef(null);

    const isInView = useInView(headerRef, {
        once: true
    })

    const { scrollYProgress } = useScroll({
        target: divRef,
        offset: ["start end", "center center"]
    })

    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.5, 0.51, 1], ["120vh", "120vh", "0vh", "0vh"]),
        { bounce: 0, duration: 1500 }
    )

    const contactEntries: ContactEntry[] = [
        { name: "Github", img: "logos/github.svg", url: "https://github.com/tranjm4" },
        { name: "LinkedIn", img: "logos/linkedin.svg", url: "https://linkedin.com/in/tranjm4" },
        { name: "Instagram", img: "logos/instagram.svg", url: "https://www.instagram.com/jpgbyjon/" }
    ]

    return (
        <div id="contact" ref={divRef} className="contact-header">
            <motion.div className="contact-content"
                style={{
                    translateY: translateY
                }}
            >
                <motion.h2 ref={headerRef}
                    animate={{
                        opacity: isInView ? 1 : 0,
                        transition: {
                            duration: 1,
                            delay: 0.5
                        }
                    }}
                >
                    Let's get in touch :)
                </motion.h2>

                <motion.div className="line"
                    animate={{
                        height: isInView ? "10rem" : 0,
                        transition: {
                            stiffness: 200,
                            duration: 1,
                            delay: 0.8
                        }
                    }}
                />

                <div className="contact-items-container">
                    {contactEntries.map((entry, index) => (
                        <a href={entry.url} target="_blank" rel="noopener">
                            <div className="contact-item" key={index}>
                                <img src={entry.img} />
                                <p>{entry.name}</p>
                            </div>
                        </a>
                    ))}
                </div>

            </motion.div>
        </div>
    )
}

export default Contact;