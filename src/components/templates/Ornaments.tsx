import React from 'react';

interface CornerProps {
  color: string;
  secondary?: string;
}

/** Rich Royal Maroon & Antique Gold Filigree Corner */
export function RoyalCorner({ color, secondary = '#c59b45' }: CornerProps) {
  return (
    <svg viewBox="0 0 110 110" fill="none" className="w-24 h-24" aria-hidden="true">
      <path d="M4 106V14C4 8.5 8.5 4 14 4H106" stroke={color} strokeWidth="2.4" />
      <path d="M11 99V18C11 14 14 11 18 11H99" stroke={secondary} strokeWidth="1.2" />
      <path d="M17 85V24C17 20 20 17 24 17H85" stroke={color} strokeWidth="0.8" opacity="0.45" />
      {/* Filigree scrollwork */}
      <path
        d="M17 58C18 35 35 18 58 17C46 22 39 29 36 39C28 38 22 44 17 58Z"
        fill={secondary}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.1"
      />
      <path
        d="M21 68C23 42 42 23 68 21"
        stroke={secondary}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Corner floral rosette */}
      <g transform="translate(26 26)">
        <circle cx="0" cy="0" r="6" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="1" />
        <path d="M0 -6L2 -2L6 0L2 2L0 6L-2 2L-6 0L-2 -2Z" fill={secondary} />
        <circle cx="0" cy="0" r="1.8" fill={color} />
      </g>
      <circle cx="48" cy="17" r="2" fill={secondary} />
      <circle cx="17" cy="48" r="2" fill={secondary} />
      <circle cx="66" cy="11" r="1.5" fill={color} />
      <circle cx="11" cy="66" r="1.5" fill={color} />
    </svg>
  );
}

/** Lush Botanical Jasmine & Rose Vine Corner */
export function FloralCorner({ color, secondary = '#4f7359' }: CornerProps) {
  return (
    <svg viewBox="0 0 116 116" fill="none" className="w-24 h-24" aria-hidden="true">
      <path d="M6 110V14C6 9.5 9.5 6 14 6H110" stroke={color} strokeWidth="1.3" opacity="0.45" />
      {/* Sweeping botanical stem */}
      <path
        d="M14 94C15 56 32 28 94 14"
        stroke={secondary}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M24 68C32 45 45 32 68 24"
        stroke={secondary}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Botanical leaves */}
      <path d="M22 68C12 64 10 54 18 48C24 53 26 60 22 68Z" fill={secondary} fillOpacity="0.28" stroke={secondary} strokeWidth="1" />
      <path d="M48 26C44 16 54 10 62 17C59 24 54 27 48 26Z" fill={secondary} fillOpacity="0.28" stroke={secondary} strokeWidth="1" />
      <path d="M36 46C43 49 50 46 52 40C45 38 39 40 36 46Z" fill={secondary} fillOpacity="0.22" stroke={secondary} strokeWidth="0.9" />
      <path d="M18 82C24 80 28 76 28 70C22 72 19 76 18 82Z" fill={secondary} fillOpacity="0.2" stroke={secondary} strokeWidth="0.9" />
      <path d="M72 20C74 26 78 28 84 26C81 21 77 19 72 20Z" fill={secondary} fillOpacity="0.2" stroke={secondary} strokeWidth="0.9" />
      {/* Main Jasmine Blossom */}
      <g transform="translate(27 27)">
        <ellipse cx="0" cy="-9" rx="3.6" ry="6.2" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1" />
        <ellipse cx="9" cy="0" rx="6.2" ry="3.6" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1" />
        <ellipse cx="0" cy="9" rx="3.6" ry="6.2" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1" />
        <ellipse cx="-9" cy="0" rx="6.2" ry="3.6" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1" />
        <ellipse cx="6.2" cy="-6.2" rx="3" ry="5" transform="rotate(45 6.2 -6.2)" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.9" />
        <ellipse cx="-6.2" cy="6.2" rx="3" ry="5" transform="rotate(45 -6.2 6.2)" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.9" />
        <circle cx="0" cy="0" r="3" fill={color} />
      </g>
      {/* Secondary bud */}
      <g transform="translate(46 37) scale(0.58)">
        <ellipse cx="0" cy="-7" rx="3" ry="5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
        <ellipse cx="7" cy="0" rx="5" ry="3" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
        <ellipse cx="0" cy="7" rx="3" ry="5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
        <ellipse cx="-7" cy="0" rx="5" ry="3" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
        <circle cx="0" cy="0" r="2.2" fill={color} />
      </g>
      <circle cx="76" cy="14" r="2.2" fill={color} opacity="0.55" />
      <circle cx="14" cy="76" r="2.2" fill={color} opacity="0.55" />
    </svg>
  );
}

/** Authentic 8-Point Islamic Geometric Medallion Corner */
export function IslamicCorner({ color, secondary = '#c2973e' }: CornerProps) {
  return (
    <svg viewBox="0 0 108 108" fill="none" className="w-24 h-24" aria-hidden="true">
      <path d="M4 104V4H104" stroke={color} strokeWidth="2.2" />
      <path d="M12 96V12H96" stroke={secondary} strokeWidth="1.2" />
      <path d="M19 82V19H82" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {/* 8-point Rub el Hizb corner star */}
      <g transform="translate(32 32)">
        <rect x="-13" y="-13" width="26" height="26" stroke={color} strokeWidth="1.3" fill={secondary} fillOpacity="0.14" />
        <rect
          x="-13"
          y="-13"
          width="26"
          height="26"
          transform="rotate(45)"
          stroke={secondary}
          strokeWidth="1.3"
          fill={color}
          fillOpacity="0.09"
        />
        <circle cx="0" cy="0" r="6" stroke={color} strokeWidth="1" fill="#ffffff" />
        <circle cx="0" cy="0" r="2.8" fill={secondary} />
      </g>
      {/* Lattice diamonds along edges */}
      <path d="M62 12L69 19L62 26L55 19Z" stroke={secondary} strokeWidth="1.1" fill={color} fillOpacity="0.08" />
      <path d="M19 55L26 62L19 69L12 62Z" stroke={secondary} strokeWidth="1.1" fill={color} fillOpacity="0.08" />
      <circle cx="82" cy="19" r="2" fill={color} />
      <circle cx="19" cy="82" r="2" fill={color} />
    </svg>
  );
}

/** Rich Traditional Bangladeshi Alpona Lotus Corner */
export function AlponaCorner({ color, secondary = '#d49a32' }: CornerProps) {
  return (
    <svg viewBox="0 0 112 112" fill="none" className="w-24 h-24" aria-hidden="true">
      <path d="M5 107V5H107" stroke={color} strokeWidth="2.3" />
      <path d="M13 99V13H99" stroke={secondary} strokeWidth="1.2" strokeDasharray="4 3" />
      {/* Concentric Alpona lotus fan */}
      <path d="M14 14C34 14 52 24 58 42C40 44 22 30 14 14Z" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="1.3" />
      <path d="M14 14C14 34 24 52 42 58C44 40 30 22 14 14Z" fill={secondary} fillOpacity="0.2" stroke={secondary} strokeWidth="1.2" />
      <path d="M14 14C36 22 48 34 52 52C34 48 22 36 14 14Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.1" />
      {/* Alpona rhythmic folk dots */}
      <circle cx="30" cy="30" r="3" fill={color} />
      <circle cx="44" cy="44" r="2.2" fill={secondary} />
      <circle cx="64" cy="20" r="2.2" fill={color} />
      <circle cx="76" cy="18" r="1.6" fill={secondary} />
      <circle cx="20" cy="64" r="2.2" fill={color} />
      <circle cx="18" cy="76" r="1.6" fill={secondary} />
      {/* Swirl tendril */}
      <path d="M58 26C66 26 72 22 80 22" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M26 58C26 66 22 72 22 80" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/** Calm Eucalyptus Leaf Corner */
export function BotanicalCorner({ color }: CornerProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-20 h-20" aria-hidden="true">
      <path d="M10 88C12 46 30 18 88 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.72" />
      <ellipse cx="21" cy="56" rx="5.5" ry="10" transform="rotate(-30 21 56)" fill={color} fillOpacity="0.17" stroke={color} strokeWidth="1" />
      <ellipse cx="34" cy="35" rx="5.5" ry="10" transform="rotate(-48 34 35)" fill={color} fillOpacity="0.17" stroke={color} strokeWidth="1" />
      <ellipse cx="56" cy="21" rx="5.5" ry="10" transform="rotate(-65 56 21)" fill={color} fillOpacity="0.17" stroke={color} strokeWidth="1" />
      <ellipse cx="32" cy="50" rx="4.2" ry="7.8" transform="rotate(42 32 50)" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.9" />
      <ellipse cx="50" cy="32" rx="4.2" ry="7.8" transform="rotate(24 50 32)" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.9" />
    </svg>
  );
}

/** Luxury Stepped Art-Deco Gold Corner */
export function ArtDecoCorner({ color, secondary = '#c9a14a' }: CornerProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-20 h-20" aria-hidden="true">
      <path d="M4 96V4H96" stroke={color} strokeWidth="2" />
      <path d="M11 88V11H88" stroke={secondary} strokeWidth="1.1" />
      <path d="M4 28H28V4" stroke={color} strokeWidth="1.5" />
      <path d="M11 38H20V20H38V11" stroke={secondary} strokeWidth="1.2" />
      <path d="M28 28L42 14" stroke={color} strokeWidth="1" opacity="0.55" />
      <path d="M28 28L14 42" stroke={color} strokeWidth="1" opacity="0.55" />
      <rect x="14" y="14" width="8" height="8" fill={secondary} fillOpacity="0.35" stroke={color} strokeWidth="1" />
    </svg>
  );
}

/** Grand Mughal Scalloped Arch Crown for Royal Mughal Arch template */
export function MughalArchHeader({
  color,
  secondary = '#c89e47',
  children,
}: {
  color: string;
  secondary?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative text-center pt-5 pb-3 mb-4">
      <svg
        viewBox="0 0 640 72"
        fill="none"
        className="w-full h-14 mx-auto block"
        aria-hidden="true"
      >
        {/* Outer graceful scalloped Mughal arch curve */}
        <path
          d="M20 66H180C220 66 245 48 268 32C290 17 308 10 320 4C332 10 350 17 372 32C395 48 420 66 460 66H620"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M40 60H186C222 60 246 44 268 30C290 16 308 12 320 9C332 12 350 16 372 30C394 44 418 60 454 60H600"
          stroke={secondary}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Finial jewel at arch apex */}
        <path d="M320 1L325 7L320 13L315 7Z" fill={secondary} />
        <circle cx="180" cy="66" r="2.5" fill={secondary} />
        <circle cx="460" cy="66" r="2.5" fill={secondary} />
      </svg>
      <div className="-mt-7 relative z-10">{children}</div>
    </div>
  );
}

/** Woven Dhakai Jamdani Geometric Border Band */
export function JamdaniBand({
  color,
  secondary = '#b83b3b',
  gold = '#c99b3b',
}: {
  color: string;
  secondary?: string;
  gold?: string;
}) {
  const diamonds = Array.from({ length: 19 });
  return (
    <svg viewBox="0 0 760 28" fill="none" className="w-full h-6 block" aria-hidden="true">
      <line x1="0" y1="3" x2="760" y2="3" stroke={color} strokeWidth="1.5" />
      <line x1="0" y1="25" x2="760" y2="25" stroke={color} strokeWidth="1.5" />
      {diamonds.map((_, i) => {
        const cx = 20 + i * 40;
        return (
          <g key={i} transform={`translate(${cx} 14)`}>
            <path
              d="M0 -8L11 0L0 8L-11 0Z"
              stroke={i % 2 === 0 ? color : secondary}
              strokeWidth="1.2"
              fill={i % 2 === 0 ? gold : secondary}
              fillOpacity="0.16"
            />
            <path d="M0 -3.5L4.5 0L0 3.5L-4.5 0Z" fill={i % 2 === 0 ? color : gold} />
            {i < diamonds.length - 1 && (
              <circle cx="20" cy="0" r="1.6" fill={gold} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Traditional Bengali Kalka (Paisley) Corner for Hindu / Sanatan Biodata */
export function KalkaCorner({ color, secondary = '#d49a32' }: CornerProps) {
  return (
    <svg viewBox="0 0 112 112" fill="none" className="w-24 h-24" aria-hidden="true">
      <path d="M4 108V12C4 7.5 7.5 4 12 4H108" stroke={color} strokeWidth="2.3" />
      <path d="M11 100V16C11 13 13 11 16 11H100" stroke={secondary} strokeWidth="1.2" />
      {/* Graceful Bengali Kalka / Paisley motif */}
      <path
        d="M17 17C38 14 58 26 56 44C54 56 38 62 28 52C21 45 24 34 32 33C38 32 42 38 38 43"
        fill={secondary}
        fillOpacity="0.16"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M17 17C14 38 26 58 44 56"
        stroke={secondary}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Vermilion bindi & scalloped alpona dots */}
      <circle cx="29" cy="29" r="3.2" fill={color} />
      <circle cx="29" cy="29" r="5.6" stroke={secondary} strokeWidth="0.9" />
      <circle cx="64" cy="18" r="2.2" fill={color} />
      <circle cx="76" cy="16" r="1.6" fill={secondary} />
      <circle cx="86" cy="16" r="1.3" fill={color} opacity="0.6" />
      <circle cx="18" cy="64" r="2.2" fill={color} />
      <circle cx="16" cy="76" r="1.6" fill={secondary} />
      <circle cx="16" cy="86" r="1.3" fill={color} opacity="0.6" />
    </svg>
  );
}

/** Sacred Open Lotus Petal Corner for Hindu & Buddhist Biodata */
export function LotusCorner({ color, secondary = '#c99b3b' }: CornerProps) {
  return (
    <svg viewBox="0 0 112 112" fill="none" className="w-24 h-24" aria-hidden="true">
      <path d="M5 107V12C5 8 8 5 12 5H107" stroke={color} strokeWidth="1.9" />
      <path d="M12 99V16C12 13.5 13.5 12 16 12H99" stroke={secondary} strokeWidth="1.1" opacity="0.85" />
      {/* Diagonal blooming lotus petals */}
      <g transform="translate(22 22)">
        <path d="M0 0C16 2 30 14 34 34C14 30 2 16 0 0Z" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="1.2" />
        <path d="M2 0C18 -4 34 4 44 16C30 18 16 14 2 0Z" fill={secondary} fillOpacity="0.2" stroke={secondary} strokeWidth="1.1" />
        <path d="M0 2C-4 18 4 34 16 44C18 30 14 16 0 2Z" fill={secondary} fillOpacity="0.2" stroke={secondary} strokeWidth="1.1" />
        <circle cx="7" cy="7" r="2.4" fill={color} />
      </g>
      <circle cx="72" cy="18" r="1.8" fill={secondary} />
      <circle cx="18" cy="72" r="1.8" fill={secondary} />
    </svg>
  );
}

/** Graceful Olive Branch & Laurel Corner for Christian Biodata */
export function OliveCorner({ color, secondary = '#b99352' }: CornerProps) {
  return (
    <svg viewBox="0 0 112 112" fill="none" className="w-24 h-24" aria-hidden="true">
      <path d="M6 106V12C6 8.5 8.5 6 12 6H106" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <path d="M13 96V16C13 14 14 13 16 13H96" stroke={secondary} strokeWidth="0.9" opacity="0.65" />
      {/* Arched olive stem */}
      <path d="M16 86C18 46 42 20 86 16" stroke={color} strokeWidth="1.35" strokeLinecap="round" />
      {/* Paired olive leaves */}
      <ellipse cx="22" cy="64" rx="4" ry="9" transform="rotate(-24 22 64)" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.95" />
      <ellipse cx="32" cy="54" rx="3.8" ry="8.5" transform="rotate(36 32 54)" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.9" />
      <ellipse cx="34" cy="38" rx="4" ry="9" transform="rotate(-48 34 38)" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.95" />
      <ellipse cx="46" cy="36" rx="3.8" ry="8.5" transform="rotate(24 46 36)" fill={color} fillOpacity="0.14" stroke={color} strokeWidth="0.9" />
      <ellipse cx="58" cy="22" rx="4" ry="9" transform="rotate(-68 58 22)" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.95" />
      {/* Tiny gold olive fruits */}
      <circle cx="27" cy="48" r="2.2" fill={secondary} />
      <circle cx="48" cy="27" r="2.2" fill={secondary} />
      <circle cx="20" cy="20" r="2" fill={secondary} />
    </svg>
  );
}

/** Sacred Bodhi (Peepal) Leaf Corner for Buddhist Biodata */
export function BodhiCorner({ color, secondary = '#c79a3b' }: CornerProps) {
  return (
    <svg viewBox="0 0 112 112" fill="none" className="w-24 h-24" aria-hidden="true">
      <path d="M5 107V12C5 8 8 5 12 5H107" stroke={color} strokeWidth="1.8" />
      <path d="M12 98V15C12 13 13 12 15 12H98" stroke={secondary} strokeWidth="1" opacity="0.75" />
      {/* Sacred heart-pointed Bodhi leaf */}
      <g transform="translate(18 18)">
        <path
          d="M4 4C18 0 34 8 34 22C34 29 29 34 22 34C8 34 0 18 4 4Z"
          fill={color}
          fillOpacity="0.14"
          stroke={color}
          strokeWidth="1.25"
        />
        {/* Elongated drip tip */}
        <path d="M29 29C35 35 41 42 46 46" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        {/* Central vein & lateral veins */}
        <path d="M5 5L30 30" stroke={secondary} strokeWidth="1" />
        <path d="M13 13L22 10M13 13L10 22M20 20L28 18M20 20L18 28" stroke={secondary} strokeWidth="0.8" opacity="0.8" />
      </g>
      <circle cx="68" cy="18" r="1.9" fill={secondary} />
      <circle cx="18" cy="68" r="1.9" fill={secondary} />
    </svg>
  );
}

/** Sacred Lotus Mandala Header Crest (Hindu & Buddhist) */
export function LotusMandalaHeader({
  color,
  secondary = '#c89e47',
  children,
}: {
  color: string;
  secondary?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="text-center mb-4">
      <div className="flex items-center justify-center gap-3 mb-1.5" aria-hidden="true">
        <span className="h-[1px] flex-1 max-w-[165px]" style={{ backgroundColor: secondary, opacity: 0.65 }} />
        <svg viewBox="0 0 96 42" fill="none" className="w-20 h-9 shrink-0">
          {/* Outer lotus petals */}
          <path d="M48 4C53 13 55 24 48 34C41 24 43 13 48 4Z" fill={color} fillOpacity="0.16" stroke={color} strokeWidth="1.3" />
          <path d="M48 34C38 28 31 19 29 10C38 14 45 22 48 34Z" fill={secondary} fillOpacity="0.22" stroke={color} strokeWidth="1.15" />
          <path d="M48 34C58 28 65 19 67 10C58 14 51 22 48 34Z" fill={secondary} fillOpacity="0.22" stroke={color} strokeWidth="1.15" />
          <path d="M48 34C32 34 20 28 14 20C24 20 36 25 48 34Z" fill={color} fillOpacity="0.1" stroke={secondary} strokeWidth="1.1" />
          <path d="M48 34C64 34 76 28 82 20C72 20 60 25 48 34Z" fill={color} fillOpacity="0.1" stroke={secondary} strokeWidth="1.1" />
          {/* Base line & jewel */}
          <path d="M22 38H74" stroke={secondary} strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="48" cy="22" r="2.5" fill={color} />
          <circle cx="14" cy="36" r="1.6" fill={secondary} />
          <circle cx="82" cy="36" r="1.6" fill={secondary} />
        </svg>
        <span className="h-[1px] flex-1 max-w-[165px]" style={{ backgroundColor: secondary, opacity: 0.65 }} />
      </div>
      {children}
    </div>
  );
}

/** Cathedral Pointed Arch & Filigree Cross Header (Christian) */
export function ChristianCrestHeader({
  color,
  secondary = '#c49d52',
  compact = false,
  children,
}: {
  color: string;
  secondary?: string;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-3 mb-2" aria-hidden="true">
        <span className="h-[1px] flex-1 max-w-[110px]" style={{ backgroundColor: secondary, opacity: 0.6 }} />
        <svg viewBox="0 0 68 34" fill="none" className="w-16 h-8 shrink-0">
          {/* Laurel sprigs */}
          <path d="M10 24C16 24 22 20 26 16" stroke={secondary} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M58 24C52 24 46 20 42 16" stroke={secondary} strokeWidth="1.1" strokeLinecap="round" />
          <ellipse cx="18" cy="20" rx="2.4" ry="4.5" transform="rotate(-40 18 20)" fill={secondary} fillOpacity="0.3" />
          <ellipse cx="50" cy="20" rx="2.4" ry="4.5" transform="rotate(40 50 20)" fill={secondary} fillOpacity="0.3" />
          {/* Fine Cross */}
          <line x1="34" y1="4" x2="34" y2="30" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="25" y1="13" x2="43" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="34" cy="13" r="2.2" fill={secondary} />
        </svg>
        <span className="h-[1px] flex-1 max-w-[110px]" style={{ backgroundColor: secondary, opacity: 0.6 }} />
      </div>
    );
  }
  return (
    <div className="relative text-center pt-2 pb-2 mb-4">
      <svg viewBox="0 0 640 76" fill="none" className="w-full h-16 mx-auto block" aria-hidden="true">
        {/* Pointed gothic cathedral arch */}
        <path
          d="M24 68H220C258 68 292 42 320 10C348 42 382 68 420 68H616"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M44 62H224C260 62 292 40 320 16C348 40 380 62 416 62H596"
          stroke={secondary}
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Filigree Cross at arch summit */}
        <line x1="320" y1="18" x2="320" y2="48" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
        <line x1="308" y1="29" x2="332" y2="29" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
        <circle cx="320" cy="29" r="3" fill={secondary} />
        {/* Olive leaves flanking arch base */}
        <ellipse cx="212" cy="60" rx="5" ry="2.6" transform="rotate(-18 212 60)" fill={secondary} fillOpacity="0.45" />
        <ellipse cx="428" cy="60" rx="5" ry="2.6" transform="rotate(18 428 60)" fill={secondary} fillOpacity="0.45" />
      </svg>
      <div className="-mt-4 relative z-10">{children}</div>
    </div>
  );
}

/** Eight-Spoke Dharmachakra (Wheel of Dharma) resting on Lotus (Buddhist) */
export function DharmachakraHeader({
  color,
  secondary = '#c99738',
  children,
}: {
  color: string;
  secondary?: string;
  children?: React.ReactNode;
}) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className="text-center mb-4">
      <div className="flex items-center justify-center gap-3 mb-1.5" aria-hidden="true">
        <span className="h-[1px] flex-1 max-w-[165px]" style={{ backgroundColor: secondary, opacity: 0.7 }} />
        <svg viewBox="0 0 88 54" fill="none" className="w-20 h-12 shrink-0">
          {/* Wheel of Dharma */}
          <g transform="translate(44 22)">
            <circle cx="0" cy="0" r="15" stroke={color} strokeWidth="1.8" fill={secondary} fillOpacity="0.1" />
            <circle cx="0" cy="0" r="11.5" stroke={secondary} strokeWidth="0.9" />
            <circle cx="0" cy="0" r="3.6" fill={secondary} stroke={color} strokeWidth="1.1" />
            {spokes.map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <line x1="0" y1="-3.6" x2="0" y2="-15" stroke={color} strokeWidth="1.2" />
                <circle cx="0" cy="-17.2" r="1.35" fill={secondary} />
              </g>
            ))}
          </g>
          {/* Open Lotus base */}
          <path d="M44 49C36 45 27 42 20 43C26 48 35 50 44 49Z" fill={secondary} fillOpacity="0.28" stroke={color} strokeWidth="0.9" />
          <path d="M44 49C52 45 61 42 68 43C62 48 53 50 44 49Z" fill={secondary} fillOpacity="0.28" stroke={color} strokeWidth="0.9" />
          <path d="M44 40C47 44 47 47 44 50C41 47 41 44 44 40Z" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="0.9" />
        </svg>
        <span className="h-[1px] flex-1 max-w-[165px]" style={{ backgroundColor: secondary, opacity: 0.7 }} />
      </div>
      {children}
    </div>
  );
}

/** Andalusian / Moorish Scalloped Horseshoe Arch (Islamic Luxury) */
export function AndalusianArchHeader({
  color,
  secondary = '#c79b42',
  children,
}: {
  color: string;
  secondary?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative text-center pt-3 pb-2 mb-4">
      <svg viewBox="0 0 640 76" fill="none" className="w-full h-16 mx-auto block" aria-hidden="true">
        {/* Scalloped Andalusian horseshoe arch */}
        <path
          d="M24 68H210C214 54 226 44 238 40C244 28 258 20 272 20C284 10 302 6 320 6C338 6 356 10 368 20C382 20 396 28 402 40C414 44 426 54 430 68H616"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M44 62H216C222 50 232 42 244 38C250 28 262 22 276 22C288 14 304 11 320 11C336 11 352 14 364 22C378 22 390 28 396 38C408 42 418 50 424 62H596"
          stroke={secondary}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* 8-point Andalusian star at apex */}
        <g transform="translate(320 14)">
          <rect x="-4.5" y="-4.5" width="9" height="9" fill={secondary} />
          <rect x="-4.5" y="-4.5" width="9" height="9" transform="rotate(45)" fill={color} />
          <circle cx="0" cy="0" r="2" fill="#ffffff" />
        </g>
        <circle cx="210" cy="68" r="2.5" fill={secondary} />
        <circle cx="430" cy="68" r="2.5" fill={secondary} />
      </svg>
      <div className="-mt-7 relative z-10">{children}</div>
    </div>
  );
}

/** Woven Banarasi Gold Zari Brocade Border Band (Hindu Silk Heritage) */
export function BanarasiZariBand({
  color = '#8b1122',
  gold = '#e3be6b',
}: {
  color?: string;
  gold?: string;
}) {
  const motifs = Array.from({ length: 24 });
  return (
    <svg viewBox="0 0 794 22" fill="none" className="w-full h-5 block" aria-hidden="true">
      <rect x="0" y="0" width="794" height="22" fill={color} />
      <line x1="0" y1="2.5" x2="794" y2="2.5" stroke={gold} strokeWidth="1.1" />
      <line x1="0" y1="19.5" x2="794" y2="19.5" stroke={gold} strokeWidth="1.1" />
      {motifs.map((_, i) => {
        const cx = 16.5 + i * 33;
        return (
          <g key={i} transform={`translate(${cx} 11)`}>
            <path d="M0 -6L6 0L0 6L-6 0Z" stroke={gold} strokeWidth="1" fill={gold} fillOpacity="0.25" />
            <circle cx="0" cy="0" r="1.6" fill={gold} />
            {i < motifs.length - 1 && (
              <path d="M12 -4L16.5 0L12 4L16.5 0L21 -4" stroke={gold} strokeWidth="0.85" opacity="0.75" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Chittagong Hill Tracts / Chakma & Marma Woven Loom Band */
export function HillLoomBand({
  indigo = '#1e3050',
  terracotta = '#b43b2a',
  gold = '#d4a13c',
}: {
  indigo?: string;
  terracotta?: string;
  gold?: string;
}) {
  const units = Array.from({ length: 15 });
  return (
    <svg viewBox="0 0 760 32" fill="none" className="w-full h-7 block" aria-hidden="true">
      <rect x="0" y="2" width="760" height="3" fill={indigo} />
      <rect x="0" y="27" width="760" height="3" fill={indigo} />
      <line x1="0" y1="7" x2="760" y2="7" stroke={terracotta} strokeWidth="1.1" />
      <line x1="0" y1="25" x2="760" y2="25" stroke={terracotta} strokeWidth="1.1" />
      {units.map((_, i) => {
        const x = 10 + i * 50;
        return (
          <g key={i} transform={`translate(${x} 16)`}>
            {/* Stepped hill-loom chevron & diamond */}
            <path
              d="M0 0L10 -7L20 0L10 7Z"
              fill={terracotta}
              fillOpacity="0.22"
              stroke={terracotta}
              strokeWidth="1.2"
            />
            <path d="M10 -3L14 0L10 3L6 0Z" fill={indigo} />
            <path
              d="M25 0L35 -7L45 0L35 7Z"
              fill={gold}
              fillOpacity="0.3"
              stroke={indigo}
              strokeWidth="1.2"
            />
            <circle cx="35" cy="0" r="2" fill={terracotta} />
          </g>
        );
      })}
    </svg>
  );
}

/** Luxury Centered Ornamental Divider */
export function OrnamentalDivider({
  color = '#7c1d2b',
  secondary = '#c59b45',
  style = 'diamond',
}: {
  color?: string;
  secondary?: string;
  style?: 'diamond' | 'floral' | 'lotus' | 'cross' | 'minimal';
}) {
  if (style === 'lotus') {
    return (
      <div className="flex items-center justify-center gap-3 my-2.5" aria-hidden="true">
        <span className="h-[1px] flex-1 max-w-[140px]" style={{ backgroundColor: color, opacity: 0.3 }} />
        <svg viewBox="0 0 64 18" fill="none" className="w-14 h-4.5">
          <path d="M32 2C35 7 35 12 32 16C29 12 29 7 32 2Z" fill={color} fillOpacity="0.24" stroke={color} strokeWidth="1" />
          <path d="M32 15C24 13 18 9 14 5C21 6 28 10 32 15Z" fill={secondary} fillOpacity="0.28" stroke={secondary} strokeWidth="0.95" />
          <path d="M32 15C40 13 46 9 50 5C43 6 36 10 32 15Z" fill={secondary} fillOpacity="0.28" stroke={secondary} strokeWidth="0.95" />
          <circle cx="32" cy="10" r="1.4" fill={color} />
        </svg>
        <span className="h-[1px] flex-1 max-w-[140px]" style={{ backgroundColor: color, opacity: 0.3 }} />
      </div>
    );
  }
  if (style === 'cross') {
    return (
      <div className="flex items-center justify-center gap-3 my-2.5" aria-hidden="true">
        <span className="h-[1px] flex-1 max-w-[140px]" style={{ backgroundColor: color, opacity: 0.3 }} />
        <svg viewBox="0 0 56 18" fill="none" className="w-12 h-4">
          <line x1="28" y1="2" x2="28" y2="16" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="22" y1="7" x2="34" y2="7" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
          <ellipse cx="14" cy="9" rx="5" ry="2.2" fill={secondary} fillOpacity="0.32" stroke={secondary} strokeWidth="0.8" />
          <ellipse cx="42" cy="9" rx="5" ry="2.2" fill={secondary} fillOpacity="0.32" stroke={secondary} strokeWidth="0.8" />
        </svg>
        <span className="h-[1px] flex-1 max-w-[140px]" style={{ backgroundColor: color, opacity: 0.3 }} />
      </div>
    );
  }
  if (style === 'floral') {
    return (
      <div className="flex items-center justify-center gap-3 my-2.5" aria-hidden="true">
        <span className="h-[1px] flex-1 max-w-[140px]" style={{ backgroundColor: color, opacity: 0.3 }} />
        <svg viewBox="0 0 64 16" fill="none" className="w-14 h-4">
          <path d="M6 8C14 8 20 4 28 8C20 12 14 8 6 8Z" fill={secondary} fillOpacity="0.35" stroke={secondary} strokeWidth="0.9" />
          <path d="M58 8C50 8 44 4 36 8C44 12 50 8 58 8Z" fill={secondary} fillOpacity="0.35" stroke={secondary} strokeWidth="0.9" />
          <circle cx="32" cy="8" r="3.2" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1" />
          <circle cx="32" cy="8" r="1.3" fill={color} />
        </svg>
        <span className="h-[1px] flex-1 max-w-[140px]" style={{ backgroundColor: color, opacity: 0.3 }} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 my-2.5" aria-hidden="true">
      <span className="h-[1px] flex-1 max-w-[140px]" style={{ backgroundColor: color, opacity: 0.35 }} />
      <svg viewBox="0 0 44 14" fill="none" className="w-10 h-3.5">
        <path d="M22 1L29 7L22 13L15 7L22 1Z" stroke={color} strokeWidth="1.2" fill={secondary} fillOpacity="0.28" />
        <circle cx="22" cy="7" r="1.8" fill={color} />
        <path d="M9 4L12 7L9 10L6 7Z" fill={secondary} />
        <path d="M35 4L38 7L35 10L32 7Z" fill={secondary} />
      </svg>
      <span className="h-[1px] flex-1 max-w-[140px]" style={{ backgroundColor: color, opacity: 0.35 }} />
    </div>
  );
}

/** Subtle Executive Monogram Crest for CV / Modern Biodata */
export function MonogramSeal({
  name,
  color,
  size = 42,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  if (!initials) return null;

  return (
    <div
      className="flex items-center justify-center shrink-0 font-bold tracking-wider select-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `1.5px solid ${color}`,
        color,
        fontSize: `${Math.round(size * 0.36)}px`,
        fontFamily: '"Cormorant Garamond", "Noto Serif Bengali", serif',
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export function FourCornerFrame({
  variant,
  color,
  secondary,
}: {
  variant:
    | 'royal'
    | 'floral'
    | 'islamic'
    | 'alpona'
    | 'botanical'
    | 'artdeco'
    | 'kalka'
    | 'lotus'
    | 'olive'
    | 'bodhi';
  color: string;
  secondary?: string;
}) {
  const CornerComp =
    variant === 'royal'
      ? RoyalCorner
      : variant === 'floral'
      ? FloralCorner
      : variant === 'islamic'
      ? IslamicCorner
      : variant === 'alpona'
      ? AlponaCorner
      : variant === 'artdeco'
      ? ArtDecoCorner
      : variant === 'kalka'
      ? KalkaCorner
      : variant === 'lotus'
      ? LotusCorner
      : variant === 'olive'
      ? OliveCorner
      : variant === 'bodhi'
      ? BodhiCorner
      : BotanicalCorner;

  return (
    <div
      data-pdf-page-frame="true"
      className="pointer-events-none absolute inset-4"
      aria-hidden="true"
    >
      <div className="absolute top-0 left-0">
        <CornerComp color={color} secondary={secondary} />
      </div>
      <div className="absolute top-0 right-0 -scale-x-100">
        <CornerComp color={color} secondary={secondary} />
      </div>
      <div className="absolute bottom-0 left-0 -scale-y-100">
        <CornerComp color={color} secondary={secondary} />
      </div>
      <div className="absolute bottom-0 right-0 -scale-x-100 -scale-y-100">
        <CornerComp color={color} secondary={secondary} />
      </div>
    </div>
  );
}
