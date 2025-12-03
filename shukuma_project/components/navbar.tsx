"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type NavItem = "dashboard" | "history" | "profile"

export function Navbar({ active }: { active?: NavItem }) {
  return (
    <header className="sticky top-0 z-40" style={{ backgroundColor: "#FFB900" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center hover:opacity-90">
            <Image
              src="/assets/logo/shukuma-logo-light.png"
              alt="Shukuma"
              width={160}
              height={40}
              priority
            />
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className={cn(
              "font-medium",
              active === "dashboard" ? "text-gray-900" : "text-gray-800 hover:text-gray-900",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/history"
            className={cn("font-medium", active === "history" ? "text-gray-900" : "text-gray-800 hover:text-gray-900")}
          >
            History
          </Link>
          <Link
            href="/profile"
            className={cn("font-medium", active === "profile" ? "text-gray-900" : "text-gray-800 hover:text-gray-900")}
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}
