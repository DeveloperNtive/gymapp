'use client';

import { useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Link from 'next/link';
import "./tabs.scss";

export default function TabComponent() {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs className='tab-container' value={value} onChange={handleChange} aria-label="icon label tabs example">
      <Tab icon={<span className="tab-circle"><FitnessCenterIcon /></span>} label="RUTINA" component={Link} href="/rutine" />
      <Tab icon={<span className="tab-circle"><FavoriteIcon /></span>} label="ENTRENAR" component={Link} href="/workout" />
      <Tab icon={<span className="tab-circle"><MilitaryTechIcon /></span>} label="PROGRESO" component={Link} href="/progress" />
      <Tab icon={<span className="tab-circle"><PersonPinIcon /></span>} label="PERFIL" component={Link} href="/profile" />
    </Tabs>
  );
}