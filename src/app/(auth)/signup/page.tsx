"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./signup.scss";

type SignUpFormValues = {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const passwordRules = {
  minLength: (value: string) =>
    value.length >= 6 || "La contraseña debe tener al menos 6 caracteres.",
  hasLowercase: (value: string) =>
    /[a-z]/.test(value) || "Debe incluir al menos una letra minúscula.",
  hasUppercase: (value: string) =>
    /[A-Z]/.test(value) || "Debe incluir al menos una letra mayúscula.",
  hasDigit: (value: string) =>
    /\d/.test(value) || "Debe incluir al menos un número.",
  hasSymbol: (value: string) =>
    /[^A-Za-z0-9]/.test(value) || "Debe incluir al menos un símbolo.",
};

export default function SignUpPage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [serverMessage, setServerMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpFormValues>();

  const passwordValue = watch("password", "");

  const blockClipboard = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/users/login", { method: "GET" });
        if (!response.ok) return;

        const payload = (await response.json()) as { session?: unknown | null };
        if (payload.session) {
          router.replace("/rutine");
          return;
        }
      } catch {
        // Ignore check failures; user can still sign up manually.
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const onSubmit = async (data: SignUpFormValues) => {
    setServerMessage("");
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            nombre: data.nombre,
            email: data.email,
            password: data.password,
          },
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setServerMessage(payload.error ?? "No se pudo crear la cuenta.");
        return;
      }

      setServerMessage("Cuenta creada. Revisa tu correo para confirmar el registro.");
      setRegisteredEmail(data.email);
      setShowSuccessModal(true);
    } catch {
      setServerMessage("Error de conexión. Intenta nuevamente.");
    }
  };

  if (isCheckingSession) {
    return (
      <main className="signup-page signup-page--checking">
        <p className="signup-checking-text">Verificando sesión...</p>
      </main>
    );
  }

  return (
    <main className="signup-page">
      <section className="signup-card">
        <p className="signup-eyebrow">Gym Access</p>
        <h1 className="signup-title">Crear cuenta</h1>
        <p className="signup-subtitle">
          Empieza hoy y lleva el control de tus entrenamientos.
        </p>

        <form className="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="signup-field">
            <label htmlFor="nombre" className="signup-label">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              autoComplete="name"
              className="signup-input"
              placeholder="Tu nombre"
              {...register("nombre", {
                required: "El nombre es obligatorio.",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres.",
                },
              })}
            />
            {errors.nombre ? <p className="signup-error-text">{errors.nombre.message}</p> : null}
          </div>

          <div className="signup-field">
            <label htmlFor="email" className="signup-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="signup-input"
              placeholder="tuemail@ejemplo.com"
              {...register("email", {
                required: "El email es obligatorio.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un email con formato válido.",
                },
              })}
            />
            {errors.email ? <p className="signup-error-text">{errors.email.message}</p> : null}
          </div>

          <div className="signup-field">
            <label htmlFor="password" className="signup-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="signup-input"
              placeholder="••••••••"
              {...register("password", {
                required: "La contraseña es obligatoria.",
                validate: passwordRules,
              })}
            />
            {errors.password ? (
              <p className="signup-error-text">{errors.password.message}</p>
            ) : (
              <p className="signup-recommendation-text">
                Recomendación: usa 8 o más caracteres para mayor seguridad.
              </p>
            )}
          </div>

          <div className="signup-field">
            <label htmlFor="confirmPassword" className="signup-label">
              Verificar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="off"
              onCopy={blockClipboard}
              onPaste={blockClipboard}
              onCut={blockClipboard}
              onDrop={(event) => event.preventDefault()}
              className="signup-input"
              placeholder="Escribe nuevamente tu contraseña"
              {...register("confirmPassword", {
                required: "Debes verificar tu contraseña.",
                validate: (value) =>
                  value === passwordValue || "Las contraseñas no coinciden.",
              })}
            />
            {errors.confirmPassword ? (
              <p className="signup-error-text">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="signup-submit-button"
          >
            {isSubmitting ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        {serverMessage ? <p className="signup-server-message">{serverMessage}</p> : null}

        <p className="signup-login-text">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="signup-login-link"
          >
            Iniciar sesión
          </Link>
        </p>
      </section>

      {showSuccessModal ? (
        <div className="signup-modal-overlay">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
            className="signup-modal"
          >
            <p className="signup-modal-eyebrow">
              Registro exitoso
            </p>
            <h2 id="success-modal-title" className="signup-modal-title">
              Confirma tu email
            </h2>
            <p className="signup-modal-text">
              Te enviamos un correo de confirmación a{" "}
              <span className="signup-modal-email">{registeredEmail}</span>. Entra a tu
              bandeja y confirma la cuenta para activar tu acceso.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/login");
              }}
              className="signup-modal-button"
            >
              Entendido
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
