'use client';

import WeekComponent from "../components/organisms/week/week";
import FloatingActionButtons from "../components/atoms/fabicon/fabicon";
import Slide from '@mui/material/Slide';
import { forwardRef, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';
import AlertDialogSlide from "../components/atoms/modal/modal";
import './rutine.scss';
import CardComponent, { type RutineCardData } from "../components/atoms/card/card";

type Rutine = RutineCardData;

export default function RutinaPage() {
  const [open, setOpen] = useState(false);
  const [rutines, setRutines] = useState<Rutine[]>([{ id: 1, ejercicio: "Peso muerto", series: 4, repeticiones: 8, esUnilateral: true, peso: 100, unidadPeso: "KG", pesoUnilateral: 50, unidadPesoUnilateral: "KG", descanso: 3, unidadDescanso: "min", frecuencia: 3, dias: ["Lunes", "Martes", "Miércoles"] }]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateRutine = (data: Omit<Rutine, 'id'>) => {
    console.log('data', JSON.stringify(data));
    setRutines((prev) => [...prev, { ...data, id: prev.length + 1 }]);
  };

  return (
    <div className="page-rutine-container">
      <div className="week-component">
        <WeekComponent />
      </div>{/*Iniciales de los dias de la semana*/}
      <div className="floating-action-buttons">
        <FloatingActionButtons onClick={handleClickOpen} />
      </div>{/*Botones flotantes*/}
      <div className="rutines-component">{rutines.map((rutine: Rutine) => (
        <CardComponent key={rutine.id} rutine={rutine} />
      ))}</div> {/*Lista de tarjetas de rutinas*/}
      <AlertDialogSlide open={open} handleClose={handleClose} onSubmitHandler={handleCreateRutine} />{/*Modal*/}
    </div>
  )
}
