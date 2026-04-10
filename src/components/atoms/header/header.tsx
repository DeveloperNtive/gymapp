'use client';

import './header.scss';
import { usePathname } from 'next/navigation';

export default function HeaderComponent() {
  const pathname = usePathname();

  return (
    <div className="header">
      {pathname === '/rutine' && <h1>Mi Rutina</h1>}
      {pathname === '/workout' && <h1>Entrenamiento</h1>}
      {pathname === '/progress' && <h1>Mi Progreso</h1>}
      {pathname === '/profile' && <h1>Mi Perfil</h1>}
    </div>
  )
}
