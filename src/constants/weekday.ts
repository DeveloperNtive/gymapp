export const WEEKDAYS = [
    "Lunes", 
    "Martes", 
    "Miércoles", 
    "Jueves", 
    "Viernes", 
    "Sábado", 
    "Domingo"
] as const;

export const WEEKDAYS_ABBREVIATIONS = [
    "L", 
    "M", 
    "M", 
    "J", 
    "V", 
    "S", 
    "D"
] as const;

/** Índice 0 = Lunes … 6 = Domingo (mismo orden que WEEKDAYS). */
export function getTodayWeekdayIndex(): number {
    const jsDay = new Date().getDay();
    return (jsDay + 6) % 7;
}