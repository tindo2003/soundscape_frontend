"use client";

import Link from "next/link";

export default function Soundscape({
  imageSize = "h-12 w-auto",
  additionalClasses = "",
}) {
  return (
    <div className={`flex items-center ${additionalClasses}`}>
      <Link href="/">
        <img
          src="/images/soundscape-text.svg"
          alt="Soundscape Logo with Text"
          className={`${imageSize} cursor-pointer`}
        />
      </Link>
    </div>
  );
}
