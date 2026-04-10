
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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import { RutineCardData } from '@/types/rutineCardData';
import { EXERCISES } from '@/constants/exercises';
import { WEEKDAYS } from '@/constants/weekday';
import './modal.scss';


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

const DEFAULT_FORM: Inputs = {
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
};

function rutineToFormValues(r: RutineCardData): Inputs {
    return {
        ejercicio: r.ejercicio,
        series: r.series,
        repeticiones: r.repeticiones,
        esUnilateral: r.esUnilateral,
        peso: r.peso,
        unidadPeso: r.unidadPeso,
        pesoUnilateral: r.pesoUnilateral,
        unidadPesoUnilateral: r.unidadPesoUnilateral,
        descanso: r.descanso,
        unidadDescanso: r.unidadDescanso,
        frecuencia: r.frecuencia,
        dias: [...(r.dias ?? [])],
    };
}

/** Incluye el valor guardado si ya no está en el catálogo (datos antiguos). */
function exerciseOptionsForValue(currentValue: string): string[] {
    const list = [...EXERCISES] as string[];
    if (currentValue && !list.includes(currentValue)) {
        return [currentValue, ...list];
    }
    return list;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
    open,
    handleClose,
    editingRutine,
    onSave,
}: {
    open: boolean;
    handleClose: () => void;
    editingRutine: RutineCardData | null;
    onSave: (data: Omit<RutineCardData, 'id'>, id?: number) => void;
}) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: DEFAULT_FORM,
    });

    React.useEffect(() => {
        if (!open) return;
        reset(editingRutine ? rutineToFormValues(editingRutine) : DEFAULT_FORM);
    }, [open, editingRutine, reset]);

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
        onSave(data, editingRutine?.id);
        handleClose();
    };

    const isEditing = editingRutine != null;

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
                    {isEditing ? 'Modifica tu rutina' : 'Crea tu rutina'}
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
                        {/* Ejercicio: Autocomplete con búsqueda al escribir */}
                        <Controller
                            name="ejercicio"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.ejercicio}>
                                    <InputLabel
                                        shrink
                                        htmlFor="rutine-ejercicio"
                                        className="label-field"
                                        id="rutine-ejercicio-label"
                                    >
                                        Ejercicio
                                    </InputLabel>
                                    <Autocomplete
                                        className="modal-exercise-autocomplete"
                                        fullWidth
                                        options={exerciseOptionsForValue(field.value)}
                                        value={field.value || null}
                                        onChange={(_, newValue) => field.onChange(newValue ?? '')}
                                        onBlur={field.onBlur}
                                        isOptionEqualToValue={(option, val) => option === val}
                                        noOptionsText="Sin coincidencias"
                                        ListboxProps={{ style: { maxHeight: 280 } }}
                                        filterOptions={(options, state) => {
                                            const q = state.inputValue.trim().toLowerCase();
                                            if (!q) return options;
                                            return options.filter((o) =>
                                                o.toLowerCase().includes(q),
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                id="rutine-ejercicio"
                                                name={field.name}
                                                inputRef={field.ref}
                                                hiddenLabel
                                                placeholder="Buscar ejercicio…"
                                                variant="outlined"
                                                error={!!errors.ejercicio}
                                                helperText={
                                                    errors.ejercicio
                                                        ? 'Selecciona un ejercicio'
                                                        : undefined
                                                }
                                                aria-labelledby="rutine-ejercicio-label"
                                            />
                                        )}
                                    />
                                </FormControl>
                            )}
                        />

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
                                <Controller
                                    name="unidadPesoUnilateral"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id="unidad-peso-unilateral-label" className='label-field'>Unidad</InputLabel>
                                            <Select
                                                labelId="unidad-peso-unilateral-label"
                                                label="Unidad"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                            >
                                                <MenuItem value="KG">KG</MenuItem>
                                                <MenuItem value="LB">LB</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel shrink htmlFor="peso-input" className='label-field'>Peso</InputLabel>
                                <input id="peso-input" type="number" min={0} {...register('peso', { required: true, min: 0 })} />
                                {errors.peso && <span style={{ color: 'red' }}>Requerido</span>}
                            </FormControl>
                            <Controller
                                name="unidadPeso"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="unidad-peso-label" className='label-field'>Unidad</InputLabel>
                                        <Select
                                            labelId="unidad-peso-label"
                                            label="Unidad"
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                        >
                                            <MenuItem value="KG">KG</MenuItem>
                                            <MenuItem value="LB">LB</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Box>

                        {/* Descanso y unidad */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel shrink htmlFor="descanso-input" className='label-field'>Descanso</InputLabel>
                                <input id="descanso-input" type="number" min={0} {...register('descanso', { required: true, min: 0 })} />
                                {errors.descanso && <span style={{ color: 'red' }}>Requerido</span>}
                            </FormControl>
                            <Controller
                                name="unidadDescanso"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="unidad-descanso-label" className='label-field'>Unidad</InputLabel>
                                        <Select
                                            labelId="unidad-descanso-label"
                                            label="Unidad"
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                        >
                                            <MenuItem value="min">Minutos</MenuItem>
                                            <MenuItem value="seg">Segundos</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
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
                                        {WEEKDAYS.map((day) => (
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

                        <Button type="submit" variant="contained" color="primary">
                            {isEditing ? 'Guardar cambios' : 'Crear rutina'}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
