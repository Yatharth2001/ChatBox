'use client'

type SpinnerProps = {
  size?: number // px
}

export default function Spinner({ size = 48 }: SpinnerProps) {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      {/* track */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-200/70" />
      {/* animated arc */}
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
    </div>
  )
}
