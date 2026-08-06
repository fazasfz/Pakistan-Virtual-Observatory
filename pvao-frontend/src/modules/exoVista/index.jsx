import React from 'react';
import ExternalModuleLaunch from '../../components/common/ExternalModuleLaunch/ExternalModuleLaunch';
import { modulesData } from '../../pages/landing/data/modules.data';

const data = modulesData.find((m) => m.id === 'exovista');

export default function ExoVistaPage() {
  return <ExternalModuleLaunch {...data} />;
}
