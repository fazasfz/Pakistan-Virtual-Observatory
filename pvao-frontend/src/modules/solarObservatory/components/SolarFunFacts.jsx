import React, { useState, useEffect } from 'react';
import { solarFunFacts } from '../data/solarFunFacts';
import styles from '../SolarObservatory.module.css';

export const SolarFunFacts = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            // Trigger fade out
            setFade(false);

            // Swap fact and fade back in
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % solarFunFacts.length);
                setFade(true);
            }, 400); // Matches CSS transition duration
        }, 7000); // Cycles every 7 seconds

        return () => clearInterval(timer);
    }, []);

    const currentFact = solarFunFacts[currentIndex];

    return (
        <div className={styles.factsWrapper}>
            <h2 className={styles.sectionTitle}>Solar Fun Facts</h2>

            <div className={styles.tickerContainer}>
                <div className={styles.tickerHeader}>
                    <span className={styles.tickerBadge}>DID YOU KNOW?</span>
                    <span className={styles.tickerCategory}>{currentFact.category}</span>
                </div>

                <div className={`${styles.tickerBody} ${fade ? styles.fadeIn : styles.fadeOut}`}>
                    <p className={styles.factQuestion}>{currentFact.question}</p>
                    <p className={styles.factAnswer}>{currentFact.answer}</p>
                </div>

                <div className={styles.dotsContainer}>
                    {solarFunFacts.map((_, idx) => (
                        <button
                            key={idx}
                            className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => {
                                setFade(false);
                                setTimeout(() => {
                                    setCurrentIndex(idx);
                                    setFade(true);
                                }, 300);
                            }}
                            aria-label={`Go to fact ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};