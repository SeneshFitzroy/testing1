/**
 * AR Logo — clean, professional Augmented Reality icon.
 * Isometric cube + bold AR text. Industry-standard "View in your space" style.
 */
export default function ARLogoIcon({ className = 'h-12 w-12', invert = false }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={`block ${className} ${invert ? 'brightness-0 invert' : ''}`}
      aria-hidden
    >
      {/* Isometric cube wireframe — 3 visible faces */}
      <path d="M24 12l12 8v16L24 40 12 32V20l12-8z" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M24 12v28M12 20v12l12 8 12-8V20" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      {/* AR text — bold, centered */}
      <text x="24" y="30" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">AR</text>
    </svg>
  )
}
