"use client";
import { usePathname } from "next/navigation";
import LayoutHeader from "./LayoutHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <LayoutHeader />;
}