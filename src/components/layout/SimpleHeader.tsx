"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import Link from "next/link";

export default function SimpleHeader() {
  return (
    <header className="border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <Logo />
      </nav>
    </header>
  );
}
