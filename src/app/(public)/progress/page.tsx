"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LockIcon from "@mui/icons-material/Lock";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CheckIcon from "@mui/icons-material/Check";
import supabase from "@/constants/supabase";
import "./progress.scss";

const LINE_POINTS = [
  { x: 0, y: 28 },
  { x: 12.5, y: 24 },
  { x: 25, y: 26 },
  { x: 37.5, y: 18 },
  { x: 50, y: 20 },
  { x: 62.5, y: 12 },
  { x: 75, y: 14 },
  { x: 87.5, y: 8 },
  { x: 100, y: 6 },
];

const BAR_HEIGHTS = [42, 55, 38, 62, 48, 70, 52];

function LineChart() {
  const d = LINE_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return (
    <svg className="progress-chart-svg" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="progressLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#progressLineGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {LINE_POINTS.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.8" fill="#FFFFFF" stroke="#22C55E" strokeWidth="1.5" />
      ))}
      {[0, 25, 50, 75, 100].map((x) => (
        <line key={x} x1={x} y1="34" x2={x} y2="36" stroke="#E2E8F0" strokeWidth="0.8" />
      ))}
    </svg>
  );
}

function BarChart() {
  const w = 100 / BAR_HEIGHTS.length;
  return (
    <svg className="progress-chart-svg" viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="progressBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      {BAR_HEIGHTS.map((h, i) => {
        const x = i * w + w * 0.2;
        const bw = w * 0.6;
        const y = 40 - h * 0.38;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={bw}
            height={40 - y}
            rx="3"
            fill="url(#progressBarGrad)"
          />
        );
      })}
    </svg>
  );
}

export default function ProgressPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setIsCheckingSession(true);
        return;
      }
      if (data.user) {
        router.replace("/progress");
        setIsCheckingSession(false);
        return;
      }
    });
  }, [router]);

  if (isCheckingSession) {
    return (
      <div className="page-workout">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <header className="progress-page__hero">
        <div className="progress-page__hero-top">
          <h1 className="progress-page__title">Mi Progreso</h1>
          <div className="progress-page__avatar" aria-hidden>
            N
          </div>
        </div>
        <p className="progress-page__subtitle">
          Tu esfuerzo de <span className="progress-page__subtitle-accent">hoy</span> es tu resultado de
          mañana.
        </p>
      </header>

      <div className="progress-page__body">
        <section className="progress-card">
          <div className="progress-card__head">
            <div className="progress-card__head-left">
              <span className="progress-card__head-icon">
                <TrendingUpIcon fontSize="inherit" />
              </span>
              <h2 className="progress-card__head-title">Progreso general</h2>
            </div>
            <div className="progress-page__select-wrap">
              <select className="progress-page__select" defaultValue="month" aria-label="Periodo">
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="year">Este año</option>
              </select>
              <span className="progress-page__select-chevron">
                <KeyboardArrowDownIcon fontSize="inherit" />
              </span>
            </div>
          </div>

          <div className="progress-level">
            <div className="progress-hex" aria-hidden>
              <StarIcon />
            </div>
            <div className="progress-level__text">
              <div className="progress-level__row">
                <p className="progress-level__name">Nivel 12</p>
                <p className="progress-level__xp">1,250 / 2,000 XP</p>
              </div>
              <p className="progress-level__tagline">Firme y constante</p>
              <div className="progress-bar" role="progressbar" aria-valuenow={1250} aria-valuemin={0} aria-valuemax={2000}>
                <div className="progress-bar__fill" />
              </div>
            </div>
          </div>

          <div className="progress-stats">
            <div className="progress-stat">
              <span className="progress-stat__icon">
                <FitnessCenterIcon fontSize="inherit" />
              </span>
              <span className="progress-stat__value">12</span>
              <span className="progress-stat__label">Entrenamientos este mes</span>
            </div>
            <div className="progress-stat">
              <span className="progress-stat__icon">
                <AccessTimeIcon fontSize="inherit" />
              </span>
              <span className="progress-stat__value">9h 24m</span>
              <span className="progress-stat__label">Tiempo total</span>
            </div>
            <div className="progress-stat">
              <span className="progress-stat__icon">
                <MonitorWeightIcon fontSize="inherit" />
              </span>
              <span className="progress-stat__value">8,450 KG</span>
              <span className="progress-stat__label">Volumen total</span>
            </div>
            <div className="progress-stat">
              <span className="progress-stat__icon">
                <LocalFireDepartmentIcon fontSize="inherit" />
              </span>
              <span className="progress-stat__value">3,250</span>
              <span className="progress-stat__label">Calorías aprox.</span>
            </div>
          </div>
        </section>

        <div className="progress-charts">
          <article className="progress-mini-card">
            <div className="progress-mini-card__top">
              <div>
                <h3 className="progress-mini-card__title">Carga levantada</h3>
                <p className="progress-mini-card__value">8,450 KG</p>
              </div>
              <span className="progress-pill">↑ 18% vs mes anterior</span>
            </div>
            <LineChart />
            <div className="progress-chart-axis">
              {["1 May", "8 May", "15 May", "22 May", "29 May"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </article>

          <article className="progress-mini-card">
            <div className="progress-mini-card__top">
              <div>
                <h3 className="progress-mini-card__title">Volumen total</h3>
                <p className="progress-mini-card__value">15,820 KG</p>
              </div>
              <span className="progress-pill">↑ 22% vs mes anterior</span>
            </div>
            <BarChart />
            <div className="progress-chart-axis">
              {["S1", "S2", "S3", "S4", "S5", "S6", "S7"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </article>
        </div>

        <section className="progress-card">
          <div className="progress-medals__head">
            <h2 className="progress-medals__title">Medallas</h2>
            <button type="button" className="progress-link">
              Ver todas
            </button>
          </div>
          <div className="progress-medals__row">
            <div className="progress-medal">
              <div className="progress-medal__hex progress-medal__hex--green">
                <FitnessCenterIcon fontSize="inherit" />
              </div>
              <span className="progress-medal__label">Primer entrenamiento — Completado</span>
            </div>
            <div className="progress-medal">
              <div className="progress-medal__hex progress-medal__hex--blue">
                <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>5</span>
              </div>
              <span className="progress-medal__label">5 entrenamientos — Completado</span>
            </div>
            <div className="progress-medal">
              <div className="progress-medal__hex progress-medal__hex--gold">
                <span style={{ fontWeight: 800, fontSize: "0.65rem" }}>10K</span>
              </div>
              <span className="progress-medal__label">10,000 KG — Total levantado</span>
            </div>
            <div className="progress-medal">
              <div className="progress-medal__hex progress-medal__hex--purple">
                <LocalFireDepartmentIcon fontSize="inherit" />
              </div>
              <span className="progress-medal__label">Racha de 7 días — Completado</span>
            </div>
            <div className="progress-medal">
              <div className="progress-medal__hex progress-medal__hex--muted">
                <LockIcon fontSize="inherit" />
              </div>
              <span className="progress-medal__label">Disciplina — Aún no desbloqueada</span>
            </div>
          </div>
        </section>

        <div className="progress-split">
          <section className="progress-card">
            <h2 className="progress-card__section-title">Racha actual</h2>
            <div className="progress-streak__main">
              <div
                className="progress-ring"
                style={{
                  background: `conic-gradient(var(--primary) 0deg ${(6 / 7) * 360}deg, #e2e8f0 ${(6 / 7) * 360}deg 360deg)`,
                }}
              >
                <div className="progress-ring__inner">
                  <WhatshotIcon fontSize="inherit" />
                </div>
              </div>
              <div>
                <p className="progress-streak__msg">7 días</p>
                <p className="progress-streak__sub">¡Sigue así!</p>
              </div>
            </div>
            <div className="progress-week">
              {[
                { letter: "L", done: true },
                { letter: "M", done: true },
                { letter: "M", done: true },
                { letter: "J", done: true },
                { letter: "V", done: true },
                { letter: "S", done: true },
                { letter: "D", done: false },
              ].map((day, index) => (
                <div key={`${day.letter}-${index}`} className="progress-week__day">
                  <span className="progress-week__letter">{day.letter}</span>
                  <div className={`progress-week__dot ${day.done ? "" : "progress-week__dot--empty"}`}>
                    {day.done ? <CheckIcon sx={{ fontSize: 14 }} /> : "—"}
                  </div>
                </div>
              ))}
            </div>
            <p className="progress-quote">La consistencia es lo que te llevará al siguiente nivel. 🚀</p>
          </section>

          <section className="progress-card">
            <div className="progress-medals__head">
              <h2 className="progress-medals__title">Mejores marcas</h2>
              <button type="button" className="progress-link">
                Ver todas
              </button>
            </div>
            <div>
              <div className="progress-pr__row">
                <span className="progress-pr__icon">
                  <FitnessCenterIcon fontSize="small" />
                </span>
                <div className="progress-pr__mid">
                  <p className="progress-pr__name">Press banca</p>
                  <p className="progress-pr__meta">1RM estimado</p>
                </div>
                <div className="progress-pr__right">
                  <p className="progress-pr__weight">90 KG</p>
                  <p className="progress-pr__delta">+5 KG</p>
                </div>
              </div>
              <div className="progress-pr__row">
                <span className="progress-pr__icon">
                  <FitnessCenterIcon fontSize="small" />
                </span>
                <div className="progress-pr__mid">
                  <p className="progress-pr__name">Sentadilla</p>
                  <p className="progress-pr__meta">1RM estimado</p>
                </div>
                <div className="progress-pr__right">
                  <p className="progress-pr__weight">120 KG</p>
                  <p className="progress-pr__delta">+10 KG</p>
                </div>
              </div>
              <div className="progress-pr__row">
                <span className="progress-pr__icon">
                  <FitnessCenterIcon fontSize="small" />
                </span>
                <div className="progress-pr__mid">
                  <p className="progress-pr__name">Peso muerto</p>
                  <p className="progress-pr__meta">1RM estimado</p>
                </div>
                <div className="progress-pr__right">
                  <p className="progress-pr__weight">140 KG</p>
                  <p className="progress-pr__delta">+5 KG</p>
                </div>
              </div>
            </div>
            <button type="button" className="progress-cta">
              Ver historial completo
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
