import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import "./tabs.scss";

const TAB_ROUTES = ['/rutine', '/workout', '/progress', '/profile'] as const;

function tabIndexForPath(pathname: string): number {
  const i = TAB_ROUTES.findIndex(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  return i === -1 ? 0 : i;
}

export default function TabComponent() {
  const pathname = usePathname();
  const value = tabIndexForPath(pathname);

  return (
    <Tabs
      className='tab-container'
      value={value}
      onChange={() => {}}
      aria-label="Navegación principal"
    >
      <Tab icon={<span className="tab-circle"><FitnessCenterIcon /></span>} label="RUTINA" component={Link} href="/rutine" />
      <Tab icon={<span className="tab-circle"><FavoriteIcon /></span>} label="ENTRENAR" component={Link} href="/workout" />
      <Tab icon={<span className="tab-circle"><MilitaryTechIcon /></span>} label="PROGRESO" component={Link} href="/progress" />
      <Tab icon={<span className="tab-circle"><PersonPinIcon /></span>} label="PERFIL" component={Link} href="/profile" />
    </Tabs>
  );
}