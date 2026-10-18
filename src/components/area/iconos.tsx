/* Iconos de línea del área de cliente: trazo de 1,8, esquinas rectas,
   mismo dibujo que la flecha de la portada. Siempre decorativos: el texto
   de al lado es el que nombra la acción. */
type IconoProps = { className?: string };

const base = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    "aria-hidden": true,
};

export function IconoHoy({ className }: IconoProps) {
    return (<svg {...base} className={className}>
      <rect x="4" y="5" width="16" height="15"/>
      <path d="M4 10h16M9 3v3M15 3v3"/>
      <rect x="11" y="13" width="2.5" height="2.5" fill="currentColor" stroke="none"/>
    </svg>);
}

export function IconoRutina({ className }: IconoProps) {
    return (<svg {...base} className={className}>
      <path d="M3 12h18M6.5 8v8M17.5 8v8M3.5 10v4M20.5 10v4"/>
    </svg>);
}

export function IconoTecnica({ className }: IconoProps) {
    return (<svg {...base} className={className}>
      <rect x="3" y="6" width="13" height="12"/>
      <path d="M16 10.5 21 8v8l-5-2.5"/>
    </svg>);
}

export function IconoProgreso({ className }: IconoProps) {
    return (<svg {...base} className={className}>
      <path d="M4 19h16M5 15l4.5-4.5 3.5 3L19 7.5"/>
      <path d="M15 7.5h4v4"/>
    </svg>);
}

export function IconoCuenta({ className }: IconoProps) {
    return (<svg {...base} className={className}>
      <circle cx="12" cy="8.5" r="3.8"/>
      <path d="M4.5 20c1-3.6 4-5.5 7.5-5.5s6.5 1.9 7.5 5.5"/>
    </svg>);
}

export function IconoMensajes({ className }: IconoProps) {
    return (<svg {...base} className={className}>
      <path d="M4 5h16v11H10l-4 3.5V16H4z"/>
    </svg>);
}

export function IconoFlecha({ className }: IconoProps) {
    return (<svg {...base} viewBox="0 0 32 32" strokeWidth={2.4} className={className}>
      <path d="M8 24 24 8M11 8h13v13"/>
    </svg>);
}

export function IconoCerrar({ className }: IconoProps) {
    return (<svg {...base} className={className}>
      <path d="M6 6l12 12M18 6 6 18"/>
    </svg>);
}

export function IconoPlay({ className }: IconoProps) {
    return (<svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>
    </svg>);
}

export function IconoSubir({ className }: IconoProps) {
    return (<svg {...base} className={className}>
      <path d="M12 16V4M7 9l5-5 5 5M4 15v5h16v-5"/>
    </svg>);
}
