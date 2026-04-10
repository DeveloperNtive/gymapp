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