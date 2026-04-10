'use client';

import './rest-day-empty.scss';

import { Box, Typography } from '@mui/material';
import WeekendIcon from '@mui/icons-material/Weekend';

type RestDayEmptyProps = {
    /** true cuando el día seleccionado es el mismo que "hoy" en el calendario de la app */
    isSelectedToday: boolean;
    /** Etiqueta del día, p. ej. "Martes" */
    weekdayLabel: string;
};

export default function RestDayEmpty({
    isSelectedToday,
    weekdayLabel,
}: RestDayEmptyProps) {
    const title = isSelectedToday
        ? 'Día de descanso'
        : 'Sin rutinas este día';

    const body = isSelectedToday
        ? 'Hoy no tienes ejercicios programados. Es un buen momento para recuperar o planificar la semana.'
        : `No hay ejercicios asignados para el ${weekdayLabel}.`;

    return (
        <Box
            className="rest-day-empty"
            role="status"
            aria-live="polite"
        >
            <Box className="rest-day-empty__icon" aria-hidden>
                <WeekendIcon />
            </Box>
            <Typography
                className="rest-day-empty__title"
                variant="h6"
                component="h2"
                id="rest-day-empty-heading"
            >
                {title}
            </Typography>
            <Typography
                className="rest-day-empty__text"
                component="p"
            >
                {body}
            </Typography>
            <Typography className="rest-day-empty__hint" component="p">
                Puedes crear una rutina con el botón «Crear Rutina» cuando quieras.
            </Typography>
        </Box>
    );
}
