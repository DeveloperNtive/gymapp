import { type RutineCardData } from "@/app/components/atoms/card/card";
import { useEffect, useState } from 'react'

export default function useStorage() {
  const [rutines, setRutines] = useState<RutineCardData[]>([]);

  useEffect(() => {
    const rutinesStorage = localStorage.getItem('rutines');
    if (rutinesStorage) {
      setRutines(JSON.parse(rutinesStorage));
    }
  }, []);

  const addRutine = (rutine: Omit<RutineCardData, 'id'>) => {
    const newRutine = { ...rutine, id: rutines.length + 1 };
    const newRutines = [...rutines, newRutine];
    setRutines(newRutines);
    localStorage.setItem('rutines', JSON.stringify(newRutines));
  }

  return { rutines, addRutine };
}