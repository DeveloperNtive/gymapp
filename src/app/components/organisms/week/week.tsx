'use client';

import './week.scss';
import { useState } from 'react';

const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function WeekComponent() {
    const [selected, setSelected] = useState<number | null>(null);
    return (
        <div className="container">
            {days.map((d, i) => (
                <span
                    key={i}
                    className={`day${selected === i ? ' selected' : ''}`}
                    onClick={() => setSelected(i)}
                    tabIndex={0}
                    role="button"
                >
                    {d}
                </span>
            ))}
        </div>
    );
}
