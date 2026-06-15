"use client";

import supabase from "@/constants/supabase";
import { getSessionResponse } from "@/types/getSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setIsCheckingSession(false);
        router.replace("/login");
        return;
      }
      if (data.user) {
        setIsCheckingSession(false);
        return;
      }
    });
  }, [router, isLoggingOut]);

  const handleLogout = async () => {
    supabase.auth.signOut().then(() => {
      router.replace("/login");
      setIsLoggingOut(false);
    }).catch((error) => {
      console.log('ERROR LOGOUT', error);
      setIsLoggingOut(false);
    });
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
        <p className="text-sm font-medium text-zinc-600">Verificando sesión...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoggingOut ? "Saliendo..." : "Cerrar sesion"}
      </button>
    </main>
  );
}
