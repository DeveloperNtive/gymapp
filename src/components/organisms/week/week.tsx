'use client';

import './week.scss';

import {
    WEEKDAYS_ABBREVIATIONS,
    getTodayWeekdayIndex,
} from '@/constants/weekday';

export default function WeekComponent({
    selectedDay,
    onDaySelected,
}: {
    selectedDay: number;
    onDaySelected: (day: number) => void;
}) {
    const todayIndex = getTodayWeekdayIndex();

    return (
        <div className="container">
            {WEEKDAYS_ABBREVIATIONS.map((d, i) => (
                <span
                    key={i}
                    className={`day${selectedDay === i ? ' selected' : ''}${
                        todayIndex === i ? ' today' : ''
                    }`}
                    onClick={() => onDaySelected(i)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onDaySelected(i);
                        }
                    }}
                    tabIndex={0}
                    role="button"
                >
                    {d}
                </span>
            ))}
        </div>
    );
}
