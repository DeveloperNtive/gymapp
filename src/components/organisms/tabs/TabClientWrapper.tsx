"use client";
import dynamic from "next/dynamic";

const TabComponent = dynamic(() => import("./tabs"), { ssr: true });

export default function TabClientWrapper() {
  return <TabComponent />;
}
