"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import supabase from "@/constants/supabase";
import "./login.scss";

type LoginFormValues = {
  email: string;
  password: string;
};

const passwordRules = {
  minLength: (value: string) =>
    value.length >= 6 || "La contraseña debe tener al menos 6 caracteres.",
  hasLowercase: (value: string) =>
    /[a-z]/.test(value) || "La contraseña debe incluir al menos una minúscula.",
  hasUppercase: (value: string) =>
    /[A-Z]/.test(value) || "La contraseña debe incluir al menos una mayúscula.",
  hasDigit: (value: string) =>
    /\d/.test(value) || "La contraseña debe incluir al menos un número.",
  hasSymbol: (value: string) =>
    /[^A-Za-z0-9]/.test(value) || "La contraseña debe incluir al menos un símbolo.",
};

export default function Login() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [serverMessage, setServerMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormValues>();

  const passwordValue = watch("password", "");

  const passwordRecommendation = useMemo(() => {
    if (!passwordValue) return "";
    if (passwordValue.length >= 8) return "Longitud recomendada alcanzada (8+ caracteres).";
    return "Recomendado: usa 8 o más caracteres para mayor seguridad.";
  }, [passwordValue]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setIsCheckingSession(false);
        return;
      }
      if (data.user) {
        router.replace("/rutine");
        return;
      }
    });
  }, [router]);

  if (isCheckingSession) {
    return (
      <main className="login-page login-page--checking">
        <p className="login-checking-text">Verificando sesión...</p>
      </main>
    );
  }

  const onSubmit = async (data: LoginFormValues) => {
    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      console.log('ERROR LOGIN', error.message);
      switch (error.message) {
        case "Invalid login credentials":
          setServerMessage("Email o contraseña incorrectos.");
          break;
        case "Load failed":
          setServerMessage("Algo salio mal, intenta nuevamente.");
          break;
        default:
          setServerMessage(error.message);
          break;
      }
      return;
    }
    setServerMessage("Inicio de sesión exitoso.");
    router.replace("/rutine");
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="login-eyebrow">Gym Access</p>
        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">
          Vuelve a tu rutina y registra tu progreso diario.
        </p>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="login-input"
              placeholder="tuemail@ejemplo.com"
              {...register("email", {
                value: "oskr9625.oemp@gmail.com",
                required: "El email es obligatorio.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un email con formato válido.",
                },
              })}
            />
            {errors.email ? (
              <p className="login-error-text">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="login-input"
              placeholder="••••••••"
              {...register("password", {
                value: "05C4r@qwer",
                required: "La contraseña es obligatoria.",
                validate: passwordRules,
              })}
            />
            {errors.password ? (
              <p className="login-error-text">{errors.password.message}</p>
            ) : passwordRecommendation ? (
              <p className={
                passwordRecommendation.toLowerCase().includes("longitud")
                  ? "login-succes-password-text"
                  : "login-error-password-text"
              }>{passwordRecommendation}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="login-submit-button"
          >
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        {serverMessage ? <p className="login-server-message">{serverMessage}</p> : null}

        <p className="login-signup-text">
          ¿Aun no tienes cuenta?{" "}
          <Link
            href="/signup"
            className="login-signup-link"
          >
            Crear cuenta
          </Link>
        </p>
      </section>
    </main>
  );
}
