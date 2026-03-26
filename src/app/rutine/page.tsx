'use client';

import WeekComponent from "../components/organisms/week/week";
import FloatingActionButtons from "../components/atoms/fabicon/fabicon";
import Slide from '@mui/material/Slide';
import { forwardRef, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';
import AlertDialogSlide from "../components/atoms/modal/modal";
import './rutine.scss';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RutinaPage() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="container">
      <div><WeekComponent /></div>{/*Iniciales de los dias de la semana*/}
      <div>
        <FloatingActionButtons onClick={handleClickOpen} />
      </div>

      {/*Modal*/}
      <AlertDialogSlide open={open} handleClose={handleClose} />
    </div>
  )
}
