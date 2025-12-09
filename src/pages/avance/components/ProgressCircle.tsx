import React from "react"

interface ProgressCircleProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  label?: string
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 160,
  strokeWidth = 12,
  color = "#3B82F6",
  bgColor = "#E5E7EB",
  label,
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percentage / 100)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90 transition-all duration-700"
        width={size}
        height={size}
      >
        {/* Círculo de fondo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={bgColor}
        />
        {/* Círculo de progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Texto central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
        {label && (
          <span className="text-sm font-medium text-gray-500 mt-1">{label}</span>
        )}
      </div>
    </div>
  )
}

export default ProgressCircle
