"use client";

import "./workout-exercise-card.scss";

import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Collapse, Typography } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { RutineCardData } from "@/types/rutineCardData";
import RestStopwatchModal from "@/components/molecules/rest-stopwatch-modal/rest-stopwatch-modal";

function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function seriesCount(r: RutineCardData): number {
  return Math.max(1, safeNumber(r.series, 1));
}

export default function WorkoutExerciseCard({
  rutine,
}: {
  rutine: RutineCardData;
}) {
  const totalSeries = seriesCount(rutine);
  const esUnilateral = rutine.esUnilateral === true;

  const [activeSet, setActiveSet] = useState(0);
  const [pesos, setPesos] = useState<number[]>(() =>
    Array.from({ length: seriesCount(rutine) }, () =>
      safeNumber(rutine.peso, 0),
    ),
  );
  const [pesosUnilateral, setPesosUnilateral] = useState<number[]>(() =>
    Array.from({ length: seriesCount(rutine) }, () =>
      safeNumber(rutine.pesoUnilateral, 0),
    ),
  );
  const [repeticiones, setRepeticiones] = useState<number[]>(() =>
    Array.from({ length: seriesCount(rutine) }, () =>
      safeNumber(rutine.repeticiones, 0),
    ),
  );

  useEffect(() => {
    const n = seriesCount(rutine);
    setActiveSet(0);
    setPesos(
      Array.from({ length: n }, () => safeNumber(rutine.peso, 0)),
    );
    setPesosUnilateral(
      Array.from({ length: n }, () => safeNumber(rutine.pesoUnilateral, 0)),
    );
    setRepeticiones(
      Array.from({ length: n }, () => safeNumber(rutine.repeticiones, 0)),
    );
  }, [
    rutine.id,
    rutine.series,
    rutine.peso,
    rutine.pesoUnilateral,
    rutine.repeticiones,
  ]);

  const i = Math.min(activeSet, totalSeries - 1);
  const peso = pesos[i] ?? 0;
  const pesoUni = pesosUnilateral[i] ?? 0;
  const reps = repeticiones[i] ?? 0;

  const setPesoAt = (v: number) => {
    setPesos((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, v);
      return next;
    });
  };
  const setPesoUniAt = (v: number) => {
    setPesosUnilateral((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, v);
      return next;
    });
  };
  const setRepsAt = (v: number) => {
    setRepeticiones((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, Math.round(v));
      return next;
    });
  };

  const bumpPeso = (delta: number) =>
    setPesoAt(Math.round((peso + delta) * 2) / 2);
  const bumpPesoUni = (delta: number) =>
    setPesoUniAt(Math.round((pesoUni + delta) * 2) / 2);
  const bumpReps = (delta: number) => setRepsAt(reps + delta);

  const advanceToNextSet = () => {
    if (activeSet < totalSeries - 1) setActiveSet((s) => s + 1);
    else setActiveSet(0);
  };

  const [expanded, setExpanded] = useState(false);
  const [restModalOpen, setRestModalOpen] = useState(false);
  const toggle = () => setExpanded((e) => !e);

  const handleRestModalClose = () => {
    setRestModalOpen(false);
    advanceToNextSet();
  };

  return (
    <Card className="workout-exercise-card" elevation={0}>
      <CardContent className="workout-exercise-card__inner">
        <Box
          className="workout-exercise-card__header"
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
        >
          <Box className="workout-exercise-card__title-row">
            <Box className="workout-exercise-card__icon" aria-hidden>
              <FitnessCenterIcon />
            </Box>
            <Typography
              className="workout-exercise-card__title"
              variant="h6"
              component="h2"
            >
              {rutine.ejercicio}
            </Typography>
          </Box>
          <ExpandMoreIcon
            className={
              expanded
                ? "workout-exercise-card__chevron workout-exercise-card__chevron--open"
                : "workout-exercise-card__chevron"
            }
            aria-hidden
          />
        </Box>

        <Collapse in={expanded} timeout="auto">
          <Box
            className="workout-exercise-card__collapse-inner workout-set-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <Typography
              className="workout-set-panel__title"
              variant="subtitle1"
              component="h3"
              align="center"
            >
              {rutine.ejercicio}: Serie {i + 1} de {totalSeries}
            </Typography>

            <Typography
              className="workout-set-panel__field-label"
              variant="body1"
              component="p"
              align="center"
            >
              PESO BILATERAL
            </Typography>

            <div className="workout-set-panel__row" role="group" aria-label="Peso bilateral">
              <button
                type="button"
                className="workout-set-panel__step-btn"
                aria-label="Disminuir peso"
                onClick={() => bumpPeso(-0.5)}
              >
                −
              </button>
              <div className="workout-set-panel__value-shell">
                <input
                  className="workout-set-panel__value-input"
                  type="number"
                  min={0}
                  step={0.5}
                  inputMode="decimal"
                  aria-label={`Peso en ${rutine.unidadPeso}`}
                  value={Number.isFinite(peso) ? peso : ""}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setPesoAt(Number.isFinite(v) ? v : 0);
                  }}
                />
                <span className="workout-set-panel__unit">
                  {rutine.unidadPeso}
                </span>
              </div>
              <button
                type="button"
                className="workout-set-panel__step-btn"
                aria-label="Aumentar peso"
                onClick={() => bumpPeso(0.5)}
              >
                +
              </button>
            </div>

            {esUnilateral && (
              <>
                <Typography
                  className="workout-set-panel__field-label"
                  variant="body1"
                  component="p"
                  align="center"
                >
                  PESO UNILATERAL
                </Typography>
                <div
                  className="workout-set-panel__row"
                  role="group"
                  aria-label="Peso unilateral"
                >
                  <button
                    type="button"
                    className="workout-set-panel__step-btn"
                    aria-label="Disminuir peso unilateral"
                    onClick={() => bumpPesoUni(-0.5)}
                  >
                    −
                  </button>
                  <div className="workout-set-panel__value-shell">
                    <input
                      className="workout-set-panel__value-input"
                      type="number"
                      min={0}
                      step={0.5}
                      inputMode="decimal"
                      aria-label={`Peso unilateral en ${rutine.unidadPesoUnilateral}`}
                      value={Number.isFinite(pesoUni) ? pesoUni : ""}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setPesoUniAt(Number.isFinite(v) ? v : 0);
                      }}
                    />
                    <span className="workout-set-panel__unit">
                      {rutine.unidadPesoUnilateral}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="workout-set-panel__step-btn"
                    aria-label="Aumentar peso unilateral"
                    onClick={() => bumpPesoUni(0.5)}
                  >
                    +
                  </button>
                </div>
              </>
            )}

            <Typography
              className="workout-set-panel__field-label"
              variant="body1"
              component="p"
              align="center"
            >
              {reps} REPS
            </Typography>

            <div className="workout-set-panel__row" role="group" aria-label="Repeticiones">
              <button
                type="button"
                className="workout-set-panel__step-btn"
                aria-label="Disminuir repeticiones"
                onClick={() => bumpReps(-1)}
              >
                −
              </button>
              <div className="workout-set-panel__value-shell workout-set-panel__value-shell--reps">
                <input
                  className="workout-set-panel__value-input workout-set-panel__value-input--reps"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  aria-label="Repeticiones"
                  value={Number.isFinite(reps) ? reps : ""}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setRepsAt(Number.isFinite(v) ? v : 0);
                  }}
                />
              </div>
              <button
                type="button"
                className="workout-set-panel__step-btn"
                aria-label="Aumentar repeticiones"
                onClick={() => bumpReps(1)}
              >
                +
              </button>
            </div>

            <Box className="workout-set-panel__actions">
              <Button
                type="button"
                variant="contained"
                disableElevation
                fullWidth
                className="workout-set-panel__complete"
                onClick={(e) => {
                  e.stopPropagation();
                  setRestModalOpen(true);
                }}
                aria-label="Completar set: descanso con cronómetro y pasar a la siguiente serie"
              >
                COMPLETAR SERIE
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
      <RestStopwatchModal
        open={restModalOpen}
        onClose={handleRestModalClose}
      />
    </Card>
  );
}
