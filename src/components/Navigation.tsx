import { Link, useLocation } from "react-router-dom"

// Color palette for consistent styling across pages
const COLORS = {
  darkPurple: "#32292F", // Headers, dark elements
  mediumPurple: "#575366", // Course cards, secondary elements
  blueGray: "#6E7DAB", // Prerequisite tooltips
  brightBlue: "#5762D5", // Hover states, accents
  lightMint: "#D1E3DD", // Light text, subtle backgrounds
  white: "#FFFFFF", // Main background
}

interface NavigationProps {
  carreraId: string
}

const Navigation = ({ carreraId }: NavigationProps) => {
  const location = useLocation()

  const navItems = [
    { label: "Home", path: `/carrera/${carreraId}` },
    { label: "Mallas", path: `/malla/${carreraId}` },
    { label: "Avance", path: `/avance/${carreraId}` },
  ]

  return (
    <nav className="shadow-md" style={{ backgroundColor: COLORS.mediumPurple }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center space-x-8 h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-md font-medium transition-all duration-200"
                style={{
                  color: isActive ? COLORS.white : COLORS.lightMint,
                  backgroundColor: isActive ? COLORS.brightBlue : "transparent",
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
