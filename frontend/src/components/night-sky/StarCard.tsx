// StarCard.tsx – thin wrapper around ObjectCard for semantic clarity
import React from 'react';
import ObjectCard from './ObjectCard';
import type { NightSkyObject } from './ObjectCard';

interface StarCardProps {
  data: NightSkyObject;
  onClick: (obj: NightSkyObject) => void;
}

const StarCard: React.FC<StarCardProps> = ({ data, onClick }) => {
  return <ObjectCard data={data} onClick={onClick} />;
};

export default StarCard;
