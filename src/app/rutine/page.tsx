'use client';

import { useMemo, useState } from "react";
import WeekComponent from "../../components/organisms/week/week";
import FloatingActionButtons from "../../components/atoms/fabicon/fabicon";
import AlertDialogSlide from "../../components/atoms/modal/modal";
import CardComponent from "../../components/atoms/card/card";
import RestDayEmpty from "../../components/molecules/rest-day-empty/rest-day-empty";
import { RutineCardData } from "@/types/rutineCardData";
import useStorage from "@/hooks/useStorage";
import { WEEKDAYS, getTodayWeekdayIndex } from "@/constants/weekday";
import './rutine.scss';

export default function RutinaPage() {
  const [open, setOpen] = useState(false);
  const [editingRutine, setEditingRutine] = useState<RutineCardData | null>(null);
  const [selectedDay, setSelectedDay] = useState(getTodayWeekdayIndex);
  const { rutines, addRutine, updateRutine, removeRutine } = useStorage();

  const dayLabel = WEEKDAYS[selectedDay];
  const todayIndex = getTodayWeekdayIndex();
  const isSelectedToday = selectedDay === todayIndex;
  const rutinesForDay = useMemo(
    () => rutines.filter((r) => (r.dias ?? []).includes(dayLabel)),
    [rutines, dayLabel],
  );

  const handleClickOpen = () => {
    setEditingRutine(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRutine(null);
  };

  const handleSaveRutine = (data: Omit<RutineCardData, 'id'>, id?: number) => {
    if (id !== undefined) updateRutine(id, data);
    else addRutine(data);
  };

  return (
    <div className="page-rutine-container">
      <div className="week-component">
        <WeekComponent selectedDay={selectedDay} onDaySelected={setSelectedDay} />
      </div>{/*Iniciales de los dias de la semana*/}
      <div className="floating-action-buttons">
        <FloatingActionButtons onClick={handleClickOpen} />
      </div>{/*Botones flotantes*/}
      <div
        className={
          rutinesForDay.length === 0
            ? 'rutines-component rutines-component--empty'
            : 'rutines-component'
        }
      >
        {rutinesForDay.length > 0 ? (
          rutinesForDay.map((rutine: RutineCardData) => (
            <CardComponent
              key={rutine.id}
              rutine={rutine}
              onEdit={() => {
                setEditingRutine(rutine);
                setOpen(true);
              }}
              onDelete={() => removeRutine(rutine.id)}
            />
          ))
        ) : (
          <RestDayEmpty
            isSelectedToday={isSelectedToday}
            weekdayLabel={dayLabel}
          />
        )}
      </div> {/*Lista de tarjetas de rutinas*/}
      <AlertDialogSlide
        open={open}
        handleClose={handleClose}
        editingRutine={editingRutine}
        onSave={handleSaveRutine}
      />
    </div>
  )
}
