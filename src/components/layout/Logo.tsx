"use client";

import Soundscape from "@/components/ui/soundscape";

export default function Logo() {
  return (
    <div className="flex items-center">
      {/* Full logo for medium and larger screens */}
      <div className="hidden md:flex items-center">
        <Soundscape
          imageSize="h-10 w-auto"
          additionalClasses="mt-1"
        />
      </div>

      {/* Icon-only logo for small screens */}
      <div className="flex md:hidden items-center">
        <img
          src="/images/logo.svg"
          alt="Soundscape Icon Logo"
          className="h-6 w-6"
        />
      </div>
    </div>
  );
}
