"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import useStorage from "@/hooks/useStorage";
import { Box, Button, Typography } from "@mui/material";
import { WEEKDAYS, getTodayWeekdayIndex } from "@/constants/weekday";
import RestDayEmpty from "@/components/molecules/rest-day-empty/rest-day-empty";
import WorkoutExerciseCard from "@/components/organisms/workout-exercise-card/workout-exercise-card";
import supabase from "@/constants/supabase";
import "./workout.scss";

export default function WorkoutPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const { rutines } = useStorage();
  const todayIndex = getTodayWeekdayIndex();
  const dayLabel = WEEKDAYS[todayIndex];

  const rutinesForToday = useMemo(
    () => rutines.filter((r) => (r.dias ?? []).includes(dayLabel)),
    [rutines, dayLabel],
  );

  const handleTerminarEntreno = () => {
    const ok = window.confirm("¿Terminar el entreno y volver al inicio?");
    if (!ok) return;
    router.push("/");
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setIsCheckingSession(true);
        return;
      }
      if (data.user) {
        router.replace("/workout");
        setIsCheckingSession(false);
        return;
      }
    });
  }, [router]);

  if (isCheckingSession) {
    return (
      <div className="page-workout">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="page-workout">
      <header className="page-workout__header">
        <Box className="page-workout__header-text">
          <Typography variant="h5" component="h1" className="page-workout__title">
            {dayLabel}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="p">
            Entrenamiento del día
          </Typography>
        </Box>
        <Button
          type="button"
          variant="outlined"
          size="small"
          color="inherit"
          className="page-workout__finish-btn"
          onClick={handleTerminarEntreno}
          aria-label="Terminar entreno y volver al inicio"
        >
          Terminar entreno
        </Button>
      </header>

      <Box
        className={
          rutinesForToday.length === 0
            ? "page-workout__content page-workout__content--empty"
            : "page-workout__content"
        }
      >
        {rutinesForToday.length > 0 ? (
          rutinesForToday.map((r) => (
            <WorkoutExerciseCard key={r.id} rutine={r} />
          ))
        ) : (
          <RestDayEmpty isSelectedToday weekdayLabel={dayLabel} />
        )}
      </Box>
    </div>
  );
}
