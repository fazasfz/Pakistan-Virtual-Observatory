import React from 'react';
import styles from './OnboardingTour.module.css';

const TourStep = ({ step, onNext, onSkip, isLast, totalSteps, currentStepIndex }) => {
  return (
    <div className={styles.tourCard}>
      <div className={styles.tourImageContainer}>
        <img src={step.image} alt={step.title} className={styles.tourImage} />
      </div>
      <div className={styles.tourContent}>
        <div className={styles.tourHeader}>
          <h3 className={styles.tourTitle}>{step.title}</h3>
          <span className={styles.stepCounter}>{currentStepIndex + 1} / {totalSteps}</span>
        </div>
        <p className={styles.tourDescription}>{step.description}</p>
        <div className={styles.tourActions}>
          <button onClick={onSkip} className={styles.skipButton}>
            Skip Tour
          </button>
          <button onClick={onNext} className={styles.nextButton}>
            {isLast ? "Got it" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourStep;
