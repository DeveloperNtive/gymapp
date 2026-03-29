
'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import type { RutineCardData } from '../card/card';
import './modal.scss';

const EXERCISES = ["Press banca", "Sentadilla", "Peso muerto", "Dominadas", "Curl bíceps", "Press militar"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

type Inputs = {
    ejercicio: string;
    series: number;
    repeticiones: number;
    esUnilateral: boolean;
    peso: number;
    unidadPeso: "KG" | "LB";
    pesoUnilateral: number;
    unidadPesoUnilateral: "KG" | "LB";
    descanso: number;
    unidadDescanso: "min" | "seg";
    frecuencia: number;
    dias: string[];
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, handleClose, onSubmitHandler }: { open: boolean, handleClose: () => void, onSubmitHandler: (rutine: Omit<RutineCardData, 'id'>) => void }) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            ejercicio: EXERCISES[0],
            series: 4,
            repeticiones: 8,
            esUnilateral: true,
            peso: 100,
            unidadPeso: 'KG',
            pesoUnilateral: 50,
            unidadPesoUnilateral: 'KG',
            descanso: 3,
            unidadDescanso: 'min',
            frecuencia: 2,
            dias: ['Lunes', 'Martes'],
        },
    });

    const frecuencia = watch('frecuencia');
    const diasSeleccionados = watch('dias');
    const esUnilateral = watch('esUnilateral');

    // Limitar la selección de días según la frecuencia
    React.useEffect(() => {
        if (diasSeleccionados.length > frecuencia) {
            setValue('dias', diasSeleccionados.slice(0, frecuencia));
        }
    }, [frecuencia, diasSeleccionados, setValue]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        handleClose();
        onSubmitHandler(data);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={() => handleClose()}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle
                    sx={{
                        m: 0,
                        pr: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                    }}
                >
                    Crea tu rutina
                    <IconButton
                        aria-label="Cerrar"
                        onClick={handleClose}
                        edge="end"
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {/* Ejercicio selector */}
                        <FormControl fullWidth>
                            <InputLabel id="ejercicio-label">Ejercicio</InputLabel>
                            <Select
                                labelId="ejercicio-label"
                                label="Ejercicio"
                                defaultValue=""
                                {...register('ejercicio', { required: true })}
                            >
                                {EXERCISES.map((ej) => (
                                    <MenuItem key={ej} value={ej}>{ej}</MenuItem>
                                ))}
                            </Select>
                            {errors.ejercicio && <span style={{ color: 'red' }}>Requerido</span>}
                        </FormControl>

                        {/* Series */}
                        <FormControl fullWidth>
                            <InputLabel shrink htmlFor="series-input" className='label-field'>Series</InputLabel>
                            <input id="series-input" type="number" min={1} {...register('series', { required: true, min: 1 })} />
                            {errors.series && <span style={{ color: 'red' }}>Requerido</span>}
                        </FormControl>

                        {/* Repeticiones */}
                        <FormControl fullWidth>
                            <InputLabel shrink htmlFor="repeticiones-input" className='label-field'>Repeticiones</InputLabel>
                            <input id="repeticiones-input" type="number" min={1} {...register('repeticiones', { required: true, min: 1 })} />
                            {errors.repeticiones && <span style={{ color: 'red' }}>Requerido</span>}
                        </FormControl>

                        <Controller
                            name="esUnilateral"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={field.value}
                                            onChange={(_, checked) => field.onChange(checked)}
                                        />
                                    }
                                    label="Ejercicio unilateral (peso por lado)"
                                />
                            )}
                        />

                        {/* Peso y unidad */}
                        {esUnilateral && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel shrink htmlFor="peso-unilateral-input" className='label-field'>Peso (unilateral)</InputLabel>
                                    <input
                                        id="peso-unilateral-input"
                                        type="number"
                                        min={0}
                                        {...register('pesoUnilateral', {
                                            validate: (value, formValues) =>
                                                !formValues.esUnilateral || (value !== undefined && !Number.isNaN(Number(value)) && Number(value) >= 0),
                                        })}
                                    />
                                    {errors.pesoUnilateral && <span style={{ color: 'red' }}>Requerido</span>}
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="unidad-peso-unilateral-label" className='label-field'>Unidad</InputLabel>
                                    <Select
                                        labelId="unidad-peso-unilateral-label"
                                        label="Unidad"
                                        defaultValue="KG"
                                        {...register('unidadPesoUnilateral')}
                                    >
                                        <MenuItem value="KG">KG</MenuItem>
                                        <MenuItem value="LB">LB</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel shrink htmlFor="peso-input" className='label-field'>Peso</InputLabel>
                                <input id="peso-input" type="number" min={0} {...register('peso', { required: true, min: 0 })} />
                                {errors.peso && <span style={{ color: 'red' }}>Requerido</span>}
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="unidad-peso-label" className='label-field'>Unidad</InputLabel>
                                <Select
                                    labelId="unidad-peso-label"
                                    label="Unidad"
                                    defaultValue="KG"
                                    {...register('unidadPeso')}
                                >
                                    <MenuItem value="KG">KG</MenuItem>
                                    <MenuItem value="LB">LB</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Descanso y unidad */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel shrink htmlFor="descanso-input" className='label-field'>Descanso</InputLabel>
                                <input id="descanso-input" type="number" min={0} {...register('descanso', { required: true, min: 0 })} />
                                {errors.descanso && <span style={{ color: 'red' }}>Requerido</span>}
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="unidad-descanso-label" className='label-field'>Unidad</InputLabel>
                                <Select
                                    labelId="unidad-descanso-label"
                                    label="Unidad"
                                    defaultValue="min"
                                    {...register('unidadDescanso')}
                                >
                                    <MenuItem value="min">Minutos</MenuItem>
                                    <MenuItem value="seg">Segundos</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Frecuencia */}
                        <FormControl fullWidth>
                            <InputLabel shrink htmlFor="frecuencia-input" className='label-field'>Frecuencia</InputLabel>
                            <input id="frecuencia-input" type="number" min={1} max={7} {...register('frecuencia', { required: true, min: 1, max: 7 })} />
                            {errors.frecuencia && <span style={{ color: 'red' }}>1-7</span>}
                        </FormControl>

                        {/* Multiselector días */}
                        <FormControl fullWidth>
                            <InputLabel id="dias-label">Días</InputLabel>
                            <Controller
                                name="dias"
                                control={control}
                                rules={{
                                    validate: (value) => value.length == frecuencia || 'Selecciona la cantidad de días igual a la frecuencia',
                                }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="dias-label"
                                        label="Días"
                                        multiple
                                        input={<OutlinedInput label="Días" />}
                                        renderValue={(selected) => (selected as string[]).join(', ')}
                                        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                                        value={field.value}
                                        onChange={(e) => {
                                            const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                                            if (value.length <= frecuencia) {
                                                field.onChange(value);
                                            }
                                        }}
                                    >
                                        {DAYS.map((day) => (
                                            <MenuItem key={day} value={day} disabled={field.value.length >= frecuencia && !field.value.includes(day)}>
                                                <Checkbox checked={field.value.indexOf(day) > -1} />
                                                <ListItemText primary={day} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.dias && <span style={{ color: 'red' }}>{errors.dias.message as string}</span>}
                        </FormControl>

                        <Button type="submit" variant="contained" color="primary">Crear rutina</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
