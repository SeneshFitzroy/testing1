/**
 * Maps icon name strings (from constants.js) to Lucide React icon components.
 * This replaces all emoji usage with professional SVG icons.
 */
import {
  Sofa,
  Armchair,
  Table,
  Coffee,
  Square,
  Bed,
  Archive,
  BookOpen,
  Monitor,
  Lightbulb,
  MonitorSmartphone,
  Home,
  UtensilsCrossed,
  Bath,
  Briefcase,
  ShowerHead,
  Lamp,
  Package,
} from 'lucide-react'

const ICON_MAP = {
  Sofa,
  Armchair,
  Table,
  Coffee,
  Square,
  Bed,
  Archive,
  BookOpen,
  Monitor,
  Lightbulb,
  MonitorSmartphone,
  Home,
  UtensilsCrossed,
  Bath,
  Briefcase,
  ShowerHead,
  Lamp,
  Package,
}

/**
 * Renders a Lucide icon by its string name.
 * Falls back to Package icon if the name isn't found.
 *
 * @param {string} name  - The Lucide icon name (e.g. 'Sofa', 'Bed')
 * @param {string} className - Tailwind/CSS classes to apply
 * @returns {JSX.Element}
 */
export function IconByName({ name, className = 'h-5 w-5' }) {
  const IconComponent = ICON_MAP[name] || Package
  return <IconComponent className={className} />
}

export default ICON_MAP
