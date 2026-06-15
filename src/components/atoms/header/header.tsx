'use client';

import './header.scss';
import { usePathname } from 'next/navigation';

export default function HeaderComponent() {
  const pathname = usePathname();

  if (pathname === "/progress" || pathname.startsWith("/progress/")) {
    return null;
  }

  return (
    <div className="header">
      {pathname === '/rutine' && <h1>Mi Rutina</h1>}
      {pathname === '/workout' && <h1>Entrenamiento</h1>}
      {pathname === '/profile' && <h1>Mi Perfil</h1>}
    </div>
  )
}
