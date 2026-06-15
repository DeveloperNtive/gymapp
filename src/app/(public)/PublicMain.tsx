"use client";

import { usePathname } from "next/navigation";

export default function PublicMain({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const immersiveProgress =
    pathname === "/progress" || pathname.startsWith("/progress/");

  return (
    <main
      className={`flex-1 overflow-y-auto pb-20 ${immersiveProgress ? "pt-0" : "pt-16"}`}
    >
      {children}
    </main>
  );
}
