import React from 'react';
import FactCarousel from '../../../components/common/FactCarousel/FactCarousel';
import { solarFunFacts } from '../data/solarFunFacts';

export const SolarFunFacts = () => {
    return <FactCarousel title="Solar Fun Facts" facts={solarFunFacts} />;
};