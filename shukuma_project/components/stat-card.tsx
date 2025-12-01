import type { ReactNode } from "react"
import Image from "next/image"

interface StatCardProps {
  icon: ReactNode | string
  label: string
  value: string | number
  trend?: { label: string; value: string }
}

export function StatCard({ icon, label, value, trend }: StatCardProps) {
  const isImagePath = typeof icon === "string" && icon.startsWith("/")

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {isImagePath ? (
          <div className="relative w-8 h-8">
            <Image src={icon || "/placeholder.svg"} alt={label} fill className="object-contain" />
          </div>
        ) : (
          <div className="text-2xl">{icon}</div>
        )}
      </div>
      {trend && (
        <div className="mt-4 text-sm text-green-600">
          {trend.label} <span className="font-semibold">{trend.value}</span>
        </div>
      )}
    </div>
  )
}
