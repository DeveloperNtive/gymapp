"use client";

import "./countdown-button.scss";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

type CountdownButtonProps = {
  /** Duración del descanso en segundos */
  durationSeconds: number;
  /** Etiqueta accesible / tooltip */
  "aria-label"?: string;
};

function formatMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CountdownButton({
  durationSeconds,
  "aria-label": ariaLabel,
}: CountdownButtonProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (durationSeconds <= 0) return;
    if (secondsLeft === null || secondsLeft <= 0) return;
    const t = window.setTimeout(() => {
      setSecondsLeft((s) => (s !== null && s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearTimeout(t);
  }, [secondsLeft, durationSeconds]);

  if (durationSeconds <= 0) {
    return (
      <Button
        type="button"
        variant="outlined"
        size="small"
        className="countdown-button"
        disabled
        aria-label="Sin tiempo de descanso configurado"
      >
        —
      </Button>
    );
  }

  const handleClick = () => {
    if (secondsLeft !== null && secondsLeft > 0) return;
    setSecondsLeft(durationSeconds);
  };

  const label =
    secondsLeft !== null
      ? formatMmSs(secondsLeft)
      : `Descanso ${formatMmSs(durationSeconds)}`;

  return (
    <Button
      type="button"
      variant="outlined"
      size="small"
      className="countdown-button"
      disabled={secondsLeft !== null && secondsLeft > 0}
      onClick={handleClick}
      aria-label={ariaLabel ?? label}
      startIcon={<TimerOutlinedIcon fontSize="small" />}
    >
      <span className="countdown-button__text" aria-live="polite">
        {label}
      </span>
    </Button>
  );
}
