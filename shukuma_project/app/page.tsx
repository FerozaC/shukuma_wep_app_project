"use client"

import Image from "next/image"
import Link from "next/link"
import { usePublicRoute } from "@/hooks/use-auth-redirect"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const { loading } = usePublicRoute()

  if (loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-300 to-sky-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center border rounded-3xl bg-pink-50/70 backdrop-blur-sm border-pink-200 shadow-sm px-8 py-10">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/assets/logo/shukuma-logo-light.png"
            alt="Shukuma Fitness App"
            width={220}
            height={60}
            priority
            className="drop-shadow-lg"
          />
        </div>
        <p className="text-xl text-gray-700">Move anytime, anywhere</p>

        <div className="mt-8 space-y-4">
          <Link href="/register" className="block">
            <Button
              size="lg"
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 rounded-full text-lg"
            >
              Create Account
            </Button>
          </Link>

          <Link href="/login" className="block">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-sky-500 text-sky-600 hover:bg-sky-50 font-semibold py-6 rounded-full text-lg bg-transparent"
            >
              Login
            </Button>
          </Link>

          <div className="text-center pt-2">
            <Link href="/workout-guest" className="text-sky-600 hover:text-sky-700 font-medium">
              Continue as Guest
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-700 mt-8 text-sm">Your personalized fitness deck experience</p>
      </div>
    </div>
  )
}
