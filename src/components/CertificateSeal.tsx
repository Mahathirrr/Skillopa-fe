type Props = { className?: string; code?: string }

/** Lencana resmi: double ring + ribbon, bukan lingkaran teks kosong. */
export function CertificateSeal({ className, code }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Skillopa verified"
    >
      <circle cx="50" cy="50" r="46" stroke="#5624d0" strokeWidth="1.25" opacity="0.45" />
      <circle cx="50" cy="50" r="38" stroke="#5624d0" strokeWidth="0.75" opacity="0.25" />
      <path
        d="M50 18 L54.5 34.5 L71 34.5 L58.25 44.5 L62.75 61 L50 51 L37.25 61 L41.75 44.5 L29 34.5 L45.5 34.5 Z"
        fill="#5624d0"
        opacity="0.12"
      />
      <path
        d="M50 24 L53 36 L65 36 L55.5 43 L58.5 55 L50 48 L41.5 55 L44.5 43 L35 36 L47 36 Z"
        fill="#863bff"
        opacity="0.35"
      />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="#5624d0"
        fontSize="6.5"
        fontWeight="700"
        fontFamily="system-ui,sans-serif"
        letterSpacing="0.14em"
      >
        OFFICIAL
      </text>
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fill="#6a6f73"
        fontSize="5.5"
        fontFamily="system-ui,sans-serif"
        letterSpacing="0.06em"
      >
        SKILLOPA
      </text>
      {code ? (
        <text
          x="50"
          y="88"
          textAnchor="middle"
          fill="#6a6f73"
          fontSize="4.5"
          fontFamily="ui-monospace,monospace"
        >
          {code.length > 14 ? `${code.slice(0, 11)}…` : code}
        </text>
      ) : null}
    </svg>
  )
}
