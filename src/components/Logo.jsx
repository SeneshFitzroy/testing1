import useThemeStore from '@/store/useThemeStore'

export default function Logo({ size = 40, showText = true, className = '', textClassName = '' }) {
  const { darkMode } = useThemeStore()

  const strokeColor = darkMode ? '#D9C7B8' : '#8B6F47'
  const chairColor = darkMode ? '#B66E41' : '#9A5A33'
  const ringColor = darkMode ? '#C4A882' : '#A07850'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        {/* Tree ring cross-section */}
        <circle cx="42" cy="42" r="32" stroke={ringColor} strokeWidth="2.5" fill="none" opacity="0.3" />
        <circle cx="42" cy="42" r="25" stroke={ringColor} strokeWidth="2" fill="none" opacity="0.4" />
        <circle cx="42" cy="42" r="18" stroke={ringColor} strokeWidth="1.8" fill="none" opacity="0.5" />
        <circle cx="42" cy="42" r="11" stroke={ringColor} strokeWidth="1.5" fill="none" opacity="0.6" />
        <circle cx="42" cy="42" r="5" stroke={ringColor} strokeWidth="1.2" fill="none" opacity="0.7" />
        <circle cx="42" cy="42" r="2" fill={ringColor} opacity="0.6" />

        {/* Stylized chair silhouette */}
        <path
          d="M58 88 C58 72, 62 65, 72 58 C78 54, 82 48, 82 40 C82 32, 78 26, 72 24 C68 22, 65 24, 65 28 C65 34, 68 38, 68 44 C68 52, 62 58, 58 62 L58 88"
          stroke={chairColor}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Chair seat */}
        <path
          d="M50 68 Q58 62, 68 65"
          stroke={chairColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Front leg */}
        <path
          d="M68 65 L72 88"
          stroke={chairColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className={`flex flex-col leading-tight ${textClassName}`}>
          <span className={`text-xl font-bold tracking-tight font-display ${
            darkMode
              ? 'text-warm-100'
              : 'bg-gradient-to-r from-darkwood to-clay bg-clip-text text-transparent'
          }`}>
            Lee Roo
          </span>
          <span className={`text-[10px] -mt-0.5 ${
            darkMode ? 'text-warm-400' : 'text-darkwood/50'
          }`}>
            {String.fromCharCode(0x0DBD, 0x0DD3)} {String.fromCharCode(0x0DBB, 0x0DD6)} &middot; Wood Designs
          </span>
        </div>
      )}
    </div>
  )
}

export function LogoIcon({ size = 32, className = '', light = false }) {
  const { darkMode } = useThemeStore()
  const useLight = light || darkMode
  const ringColor = useLight ? '#C4A882' : '#A07850'
  const chairColor = useLight ? '#B66E41' : '#9A5A33'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="42" cy="42" r="32" stroke={ringColor} strokeWidth="2.5" fill="none" opacity="0.3" />
      <circle cx="42" cy="42" r="25" stroke={ringColor} strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="42" cy="42" r="18" stroke={ringColor} strokeWidth="1.8" fill="none" opacity="0.5" />
      <circle cx="42" cy="42" r="11" stroke={ringColor} strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="42" cy="42" r="5" stroke={ringColor} strokeWidth="1.2" fill="none" opacity="0.7" />
      <circle cx="42" cy="42" r="2" fill={ringColor} opacity="0.6" />
      <path
        d="M58 88 C58 72, 62 65, 72 58 C78 54, 82 48, 82 40 C82 32, 78 26, 72 24 C68 22, 65 24, 65 28 C65 34, 68 38, 68 44 C68 52, 62 58, 58 62 L58 88"
        stroke={chairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M50 68 Q58 62, 68 65" stroke={chairColor} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M68 65 L72 88" stroke={chairColor} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
