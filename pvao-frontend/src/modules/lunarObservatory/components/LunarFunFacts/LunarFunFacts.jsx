import React, { useState } from 'react';
import styles from './LunarFunFacts.module.css';
import { lunarFunFacts } from './funFacts.data';

const LunarFunFacts = () => {
    const [factIndex, setFactIndex] = useState(0);

    const nextFact = () => {
        setFactIndex((prev) => (prev + 1) % lunarFunFacts.length);
    };

    const prevFact = () => {
        setFactIndex((prev) => (prev - 1 + lunarFunFacts.length) % lunarFunFacts.length);
    };

    return (
        <div className={styles.funFactsWidget}>
            <div className={styles.title}>Lunar Fun Facts</div>
            <div className={styles.factText}>"{lunarFunFacts[factIndex]}"</div>
            <div className={styles.controls}>
                <button className={styles.btn} onClick={prevFact}>&lt; PREV</button>
                <button className={styles.btn} onClick={nextFact}>NEXT &gt;</button>
            </div>
        </div>
    );
};

export default LunarFunFacts;
