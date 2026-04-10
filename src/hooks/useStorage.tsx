import type { RutineCardData } from "@/types/rutineCardData";
import { useEffect, useState } from "react";

export default function useStorage() {
  const [rutines, setRutines] = useState<RutineCardData[]>([]);

  useEffect(() => {
    const rutinesStorage = localStorage.getItem("rutines");
    if (rutinesStorage) {
      setRutines(JSON.parse(rutinesStorage));
    }
  }, []);

  const addRutine = (rutine: Omit<RutineCardData, "id">) => {
    setRutines((prev) => {
      const nextId = Math.max(0, ...prev.map((r) => r.id)) + 1;
      const next = [...prev, { ...rutine, id: nextId }];
      localStorage.setItem("rutines", JSON.stringify(next));
      return next;
    });
  };

  const updateRutine = (id: number, data: Omit<RutineCardData, "id">) => {
    setRutines((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...data, id } : r));
      localStorage.setItem("rutines", JSON.stringify(next));
      return next;
    });
  };

  const removeRutine = (id: number) => {
    setRutines((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem("rutines", JSON.stringify(next));
      return next;
    });
  };

  return { rutines, addRutine, updateRutine, removeRutine };
}
