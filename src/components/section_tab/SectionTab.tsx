import React from 'react';
import "./SectionTab.css";


const SectionTab: React.FC = () => {
    const sections: string[] = ["About", "Projects", "Skills", "Contact"]

    const scrollToSection = (sectionName: string) => {
        const element = document.getElementById(sectionName.toLowerCase());
        if (element) {
            // Get window height
            let offset = window.innerHeight * 0.5;

            // Add extra scroll for Contact section
            if (sectionName.toLowerCase() === 'contact') {
                offset = 0;
            }

            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    }

    return (
        <>
            <div className="tabs-header">
                <div className="tabs-container">
                    {sections.map((sectionName) => (
                        <button
                            key={sectionName}
                            className={`section-tab ${sectionName.toLowerCase()}-tab`}
                            onClick={() => scrollToSection(sectionName)}
                        >
                            {sectionName}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SectionTab;