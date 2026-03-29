"use client";

import './card.scss';

import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import RepeatIcon from "@mui/icons-material/Repeat";
import TimerIcon from "@mui/icons-material/Timer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ScaleIcon from "@mui/icons-material/Scale";

export type RutineCardData = {
    id: number;
    ejercicio: string;
    series: number;
    repeticiones: number;
    esUnilateral: boolean;
    peso: number;
    unidadPeso: 'KG' | 'LB';
    pesoUnilateral: number;
    unidadPesoUnilateral: 'KG' | 'LB';
    descanso: number;
    unidadDescanso: 'min' | 'seg';
    frecuencia: number;
    dias: string[];
};

export default function CardComponent({ rutine }: { rutine: RutineCardData }) {
    const esUnilateral = rutine.esUnilateral === true;

    const descansoUnidad =
        rutine.unidadDescanso === 'min' ? 'min' : 'seg';

    const diasTexto = (rutine.dias ?? []).join(', ');

    return (
        <Card className="card">
            <CardContent>
                <Box className="card-header">
                    <Box className="titleContainer">
                        <Box className="icon" aria-hidden>
                            <FitnessCenterIcon />
                        </Box>
                        <Typography className="card-title" variant="h6" component="h2">
                            {rutine.ejercicio}
                        </Typography>
                    </Box>

                    <IconButton className="menu-button" size="small" aria-label="Más opciones">
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                <Box
                    className={esUnilateral ? 'grid grid--unilateral' : 'grid'}
                >
                    <Box className="item">
                        <FormatListBulletedIcon className="item-icon" />
                        <Typography className="item-text" component="p">
                            <strong>{rutine.series}</strong>
                            {' '}
                            Series
                        </Typography>
                    </Box>

                    <Box className="item">
                        <RepeatIcon className="item-icon" />
                        <Typography className="item-text" component="p">
                            <strong>{rutine.repeticiones}</strong>
                            {' '}
                            Repeticiones
                        </Typography>
                    </Box>

                    {esUnilateral ? (
                        <>
                            <Box className="item">
                                <ScaleIcon className="item-icon" />
                                <Typography className="item-text" component="p">
                                    Peso{' '}
                                    <strong>
                                        {rutine.peso} {rutine.unidadPeso}
                                    </strong>
                                </Typography>
                            </Box>
                            <Box className="item">
                                <ScaleIcon className="item-icon" />
                                <Typography className="item-text" component="p">
                                    Peso{' '}
                                    <strong>
                                        {rutine.pesoUnilateral} {rutine.unidadPesoUnilateral}
                                    </strong>
                                    <span className="item-suffix"> (por lado)</span>
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <Box className="item">
                            <ScaleIcon className="item-icon" />
                            <Typography className="item-text" component="p">
                                Peso{' '}
                                <strong>
                                    {rutine.peso} {rutine.unidadPeso}
                                </strong>
                            </Typography>
                        </Box>
                    )}

                    <Box
                        className={
                            esUnilateral ? 'item item--descanso-full' : 'item'
                        }
                    >
                        <TimerIcon className="item-icon" />
                        <Typography className="item-text" component="p">
                            Descanso{' '}
                            <strong>
                                {rutine.descanso} {descansoUnidad}
                            </strong>
                        </Typography>
                    </Box>
                </Box>

                <Box className="card-footer">
                    <Box className="footer-row">
                        <AccessTimeIcon className="footer-icon" />
                        <Typography className="footer-text" component="p">
                            Frecuencia:{' '}
                            <strong>{rutine.frecuencia}x</strong>
                            {' '}
                            por semana
                        </Typography>
                    </Box>
                    <Box className="footer-row">
                        <CalendarTodayIcon className="footer-icon" />
                        <Typography className="footer-text" component="p">
                            Días:{' '}
                            <strong>{diasTexto}</strong>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
