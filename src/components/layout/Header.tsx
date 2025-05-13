"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-4">
          <Button variant="ghost">Help center</Button>
          <Button variant="ghost">Contact</Button>
          <Link href="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
