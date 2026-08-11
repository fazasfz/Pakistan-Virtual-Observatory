import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import styles from './MoonWeight.module.css';

const MoonWeight = () => {
  const [earthWeight, setEarthWeight] = useState('');

  const calculateMoonWeight = (weight) => {
    const parsed = parseFloat(weight);
    if (isNaN(parsed)) return '0.0';
    return (parsed * 0.1656).toFixed(1);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <Scale size={18} />
        Moon Weight Calculator
      </h3>
      
      <div className={styles.inputGroup}>
        <input
          type="number"
          className={styles.input}
          placeholder="Enter Earth weight..."
          value={earthWeight}
          onChange={(e) => setEarthWeight(e.target.value)}
        />
        <span className={styles.unit}>lbs / kg</span>
      </div>

      <div className={styles.resultBox}>
        <span className={styles.resultLabel}>On the Moon:</span>
        <span className={styles.resultValue}>
          {earthWeight ? calculateMoonWeight(earthWeight) : '0.0'}
        </span>
      </div>
    </div>
  );
};

export default MoonWeight;
