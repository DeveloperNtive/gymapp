"use client";
import dynamic from "next/dynamic";

const TabComponent = dynamic(() => import("./tabs"), { ssr: false });

export default function TabClientWrapper() {
  return <TabComponent />;
}
