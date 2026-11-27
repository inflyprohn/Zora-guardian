import { calculateLiters, getCisternAlertState } from "./types";

interface ConcreteCisternVisualProps {
  level: number;
  isFilling: boolean;
  isConsuming: boolean;
}

export function ConcreteCisternVisual({
  level,
  isFilling,
  isConsuming,
}: ConcreteCisternVisualProps) {
  const clampedLevel = Math.max(0, Math.min(100, level));
  const liters = calculateLiters(clampedLevel);
  const alertState = getCisternAlertState(clampedLevel);

  // Inner water cavity geometry inside our 640x430 SVG viewBox:
  // Top ceiling inner face = y: 92, Tank floor = y: 374 -> total water height = 282px
  const cavityTop = 92;
  const cavityBottom = 374;
  const cavityHeight = cavityBottom - cavityTop; // 282
  const waterHeight = (clampedLevel / 100) * cavityHeight;
  const waterSurfaceY = cavityBottom - waterHeight;

  // Sensor transducer bottom is at y = 104
  const transducerY = 104;
  const distanceToWater = Math.max(12, waterSurfaceY - transducerY);

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="0 0 640 420"
        className="w-full h-auto drop-shadow-[0_24px_45px_rgba(2,10,24,0.65)]"
        role="img"
        aria-label={`Cisterna de concreto al ${clampedLevel}% (${liters.toLocaleString("es-HN")} litros)`}
      >
        <defs>
          {/* Concrete aggregate texture filter */}
          <filter id="concreteGrain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              seed="14"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.72  0 0 0 0 0.75  0 0 0 0 0.76  0 0 0 0.16 0"
              in="noise"
              result="coloredNoise"
            />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>

          {/* Concrete wall cutaway gradients */}
          <linearGradient id="concreteFrontGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9aa3a9" />
            <stop offset="45%" stopColor="#7a848b" />
            <stop offset="100%" stopColor="#5e676e" />
          </linearGradient>

          <linearGradient id="concreteBevelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c666e" />
            <stop offset="100%" stopColor="#353f47" />
          </linearGradient>

          {/* Interior concrete back wall & masonry blocks */}
          <linearGradient id="interiorWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#132a42" />
            <stop offset="45%" stopColor="#193855" />
            <stop offset="100%" stopColor="#0f253a" />
          </linearGradient>

          <pattern id="masonryBlocks" width="48" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 24"
              fill="none"
              stroke="rgba(160, 200, 230, 0.08)"
              strokeWidth="1"
            />
            <path
              d="M 24 0 L 24 12 M 0 12 L 48 12"
              fill="none"
              stroke="rgba(160, 200, 230, 0.06)"
              strokeWidth="1"
            />
          </pattern>

          {/* Water body realistic translucent gradient */}
          <linearGradient id="waterBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3ad3f2" stopOpacity="0.82" />
            <stop offset="22%" stopColor="#1599cf" stopOpacity="0.84" />
            <stop offset="68%" stopColor="#0a6096" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#073d68" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="waterSurfaceGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b2f7ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#42d4ef" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1289bc" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="waterReflectionLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8ceeff" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#45c8ea" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0b4f82" stopOpacity="0" />
          </linearGradient>

          {/* Caustic floor glow */}
          <radialGradient id="floorCaustics" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#6ceeff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#26a9d6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#073d68" stopOpacity="0" />
          </radialGradient>

          {/* Metallic pipe & ladder gradients */}
          <linearGradient id="metalLadderGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5b6a75" />
            <stop offset="40%" stopColor="#b9c6cf" />
            <stop offset="75%" stopColor="#72828e" />
            <stop offset="100%" stopColor="#47535d" />
          </linearGradient>

          <linearGradient id="pvcPipeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8e1e6" />
            <stop offset="45%" stopColor="#a7b4bc" />
            <stop offset="100%" stopColor="#6f7c85" />
          </linearGradient>

          {/* Sensor housing */}
          <linearGradient id="sensorBoxGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3540" />
            <stop offset="50%" stopColor="#171f27" />
            <stop offset="100%" stopColor="#0f151b" />
          </linearGradient>

          {/* Clip path for exact interior cavity (keeps water strictly inside concrete walls!) */}
          <clipPath id="cisternCavityClip">
            <rect x="86" y="92" width="468" height="282" rx="10" />
          </clipPath>
        </defs>

        {/* Subtle ambient floor shadow beneath cistern */}
        <ellipse cx="320" cy="398" rx="255" ry="14" fill="#020b18" opacity="0.65" />

        {/* === 1. TOP INSPECTION HATCH RIM === */}
        <ellipse cx="320" cy="70" rx="135" ry="12" fill="#4f5961" stroke="#859199" strokeWidth="1.5" />
        <ellipse cx="320" cy="67" rx="126" ry="8" fill="#6f7a82" stroke="#aab4bc" strokeWidth="1" />

        {/* === 2. CONCRETE CUTAWAY OUTER FRAME === */}
        {/* Outer concrete block */}
        <rect
          x="62"
          y="72"
          width="516"
          height="320"
          rx="16"
          fill="url(#concreteFrontGrad)"
          stroke="#b2bcc2"
          strokeWidth="1.5"
        />
        {/* Aggregate grain overlay on concrete frame */}
        <rect
          x="62"
          y="72"
          width="516"
          height="320"
          rx="16"
          fill="#ffffff"
          filter="url(#concreteGrain)"
          opacity="0.7"
        />

        {/* Inner beveled concrete depth rim */}
        <rect
          x="79"
          y="85"
          width="482"
          height="296"
          rx="12"
          fill="url(#concreteBevelGrad)"
          stroke="#2c363e"
          strokeWidth="1.5"
        />

        {/* === 3. INTERIOR CAVITY (BACK WALL + LADDER + PIPES + WATER + SONAR) === */}
        <g clipPath="url(#cisternCavityClip)">
          {/* Interior concrete back wall */}
          <rect x="86" y="92" width="468" height="282" fill="url(#interiorWallGrad)" />
          <rect x="86" y="92" width="468" height="282" fill="url(#masonryBlocks)" />

          {/* Perspective inner floor */}
          <polygon
            points="86,374 128,342 512,342 554,374"
            fill="#0d2238"
            stroke="#2a4f70"
            strokeWidth="1"
          />
          {/* Perspective side walls */}
          <polygon points="86,92 128,118 128,342 86,374" fill="#102943" opacity="0.7" />
          <polygon points="554,92 512,118 512,342 554,374" fill="#0d233a" opacity="0.8" />

          {/* Caustic glow on tank floor when water > 0 */}
          {clampedLevel > 0 && (
            <g className="animate-caustics" style={{ transformOrigin: "320px 358px" }}>
              <ellipse cx="320" cy="358" rx="195" ry="18" fill="url(#floorCaustics)" />
              <path
                d="M150 356 Q200 348 250 357 T350 356 T470 357"
                fill="none"
                stroke="#7beeff"
                strokeWidth="1.2"
                opacity="0.35"
              />
              <path
                d="M175 364 Q230 357 290 365 T420 363 T495 364"
                fill="none"
                stroke="#7beeff"
                strokeWidth="1"
                opacity="0.28"
              />
            </g>
          )}

          {/* === RIGHT STAINLESS STEEL METALLIC LADDER & OUTLET SUCTION PIPE === */}
          <g id="metallic-ladder">
            {/* Vertical outlet suction pipe behind/next to ladder */}
            <rect x="488" y="106" width="8" height="252" rx="3" fill="url(#metalLadderGrad)" />
            <rect x="485" y="346" width="14" height="12" rx="2" fill="#4f5f6b" />
            {/* Ladder mounting brackets */}
            {[135, 200, 265, 330].map((yPos) => (
              <g key={yPos}>
                <rect x="514" y={yPos} width="26" height="5" rx="1.5" fill="url(#metalLadderGrad)" />
                <circle cx="536" cy={yPos + 2.5} r="2.5" fill="#9fb0bc" />
              </g>
            ))}
            {/* Ladder left & right rails */}
            <rect x="498" y="116" width="7" height="248" rx="3.5" fill="url(#metalLadderGrad)" />
            <rect x="518" y="116" width="7" height="248" rx="3.5" fill="url(#metalLadderGrad)" />
            {/* Ladder rungs */}
            {[138, 178, 218, 258, 298, 338].map((rungY) => (
              <rect
                key={rungY}
                x="500"
                y={rungY}
                width="22"
                height="5.5"
                rx="2.5"
                fill="url(#metalLadderGrad)"
              />
            ))}
          </g>

          {/* === LEFT INLET ELBOW & POURING STREAM === */}
          <g id="inlet-pipe-interior">
            {/* Wall flange */}
            <rect x="86" y="128" width="12" height="28" rx="2" fill="#707f89" />
            {/* Horizontal stub + 90 deg elbow */}
            <path
              d="M92 135 H118 Q132 135 132 149 V164 H119 V151 Q119 147 115 147 H92 Z"
              fill="url(#pvcPipeGrad)"
              stroke="#53616b"
              strokeWidth="1"
            />
            <rect x="116" y="161" width="19" height="5" rx="1.5" fill="#8998a2" />

            {/* Animated water stream pouring from inlet elbow when filling */}
            {isFilling && clampedLevel < 100 && (
              <g>
                <path
                  d={`M122 166 Q124 ${(166 + waterSurfaceY) / 2} 127 ${Math.max(170, waterSurfaceY + 4)}`}
                  fill="none"
                  stroke="#72e8ff"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.78"
                />
                <path
                  d={`M125 166 Q127 ${(166 + waterSurfaceY) / 2} 130 ${Math.max(170, waterSurfaceY + 4)}`}
                  fill="none"
                  stroke="#dffbff"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                {/* Splash ring on water surface */}
                <ellipse
                  cx="128"
                  cy={waterSurfaceY}
                  rx="16"
                  ry="3.5"
                  fill="none"
                  stroke="#a9f6ff"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              </g>
            )}
          </g>

          {/* === DYNAMIC INDEPENDENT WATER ELEMENT (MOVES SMOOTHLY WITH LEVEL) === */}
          <g
            style={{
              transform: `translateY(${waterSurfaceY}px)`,
              transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Layered Animated Wave Crest 2 (Back wave) */}
            {clampedLevel > 0 && (
              <g className="animate-wave-reverse" style={{ opacity: 0.55 }}>
                <path
                  d="M0,4 Q58,-5 117,4 T234,4 T351,4 T468,4 T585,4 T702,4 T819,4 T936,4 T1053,4 L1053,310 L0,310 Z"
                  transform="translate(86, -4)"
                  fill="#29b8e0"
                />
              </g>
            )}

            {/* Main Water Column + Wave Crest 1 (Front wave) */}
            {clampedLevel > 0 && (
              <g className="animate-wave-forward">
                <path
                  d="M0,4 Q58,12 117,4 T234,4 T351,4 T468,4 T585,4 T702,4 T819,4 T936,4 T1053,4 L1053,310 L0,310 Z"
                  transform="translate(86, -4)"
                  fill="url(#waterBodyGrad)"
                />
                {/* Glowing surface meniscus line */}
                <path
                  d="M0,4 Q58,12 117,4 T234,4 T351,4 T468,4 T585,4 T702,4 T819,4 T936,4 T1053,4"
                  transform="translate(86, -4)"
                  fill="none"
                  stroke="#aaf6ff"
                  strokeWidth="2.2"
                  opacity="0.9"
                />
              </g>
            )}

            {/* Vertical light refraction shafts & reflections moving with water */}
            {clampedLevel > 2 && (
              <g opacity="0.85">
                <polygon points="105,6 185,6 225,280 95,280" fill="url(#waterReflectionLeft)" />
                <polygon points="270,6 340,6 365,280 250,280" fill="url(#waterReflectionLeft)" opacity="0.65" />
                <polygon points="410,6 465,6 480,280 395,280" fill="url(#waterReflectionLeft)" opacity="0.5" />

                {/* Micro-bubbles rising inside water */}
                <circle cx="140" cy="70" r="2.2" fill="#b7f8ff" className="animate-bubble-1" />
                <circle cx="154" cy="95" r="1.6" fill="#d9fbff" className="animate-bubble-2" />
                <circle cx="132" cy="110" r="2.8" fill="#8eefff" className="animate-bubble-3" />
                {isConsuming && (
                  <circle cx="485" cy="90" r="2.2" fill="#b7f8ff" className="animate-bubble-1" />
                )}
              </g>
            )}
          </g>

          {/* === ULTRASONIC TRANSDUCER & DYNAMIC WAVES OVER WATER SURFACE === */}
          <g id="ultrasonic-waves">
            {/* Transducer nozzle inside ceiling */}
            <rect x="303" y="92" width="34" height="12" rx="4" fill="#1b242d" stroke="#536878" strokeWidth="1" />
            <ellipse cx="320" cy="104" rx="11" ry="3.5" fill="#63e6ff" opacity="0.9" />

            {/* 4 concentric ultrasonic arcs scaled cleanly above current water level */}
            {(() => {
              const maxSpan = Math.min(130, Math.max(28, distanceToWater - 10));
              const steps = [0.22, 0.44, 0.68, 0.92];
              const animClasses = [
                "animate-sonar-1",
                "animate-sonar-2",
                "animate-sonar-3",
                "animate-sonar-4",
              ];
              return steps.map((ratio, idx) => {
                const arcY = transducerY + 8 + maxSpan * ratio;
                const halfWidth = 18 + idx * 14;
                const curveDrop = 7 + idx * 3;
                return (
                  <path
                    key={idx}
                    d={`M ${320 - halfWidth} ${arcY} Q 320 ${arcY + curveDrop} ${320 + halfWidth} ${arcY}`}
                    fill="none"
                    stroke={clampedLevel <= 15 ? "#ff8b84" : "#67ecff"}
                    strokeWidth={2.4 - idx * 0.25}
                    strokeLinecap="round"
                    className={animClasses[idx]}
                  />
                );
              });
            })()}
          </g>

          {/* === CENTRAL PERCENTAGE & LITERS OVERLAY INSIDE CISTERN === */}
          <g pointerEvents="none">
            <text
              x="320"
              y="246"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="48"
              fontWeight="700"
              className="font-display tabular-nums"
              style={{ textShadow: "0 3px 14px rgba(2,14,32,0.85)" }}
            >
              {clampedLevel}%
            </text>
            <text
              x="320"
              y="270"
              textAnchor="middle"
              fill="#d5f2fc"
              fontSize="14"
              fontWeight="500"
              style={{ textShadow: "0 2px 8px rgba(2,14,32,0.85)" }}
            >
              Nivel actual
            </text>
            {/* Subtle dual-wave emblem below label */}
            <path
              d="M304 284 Q312 279 320 284 T336 284"
              fill="none"
              stroke="#5ee3ff"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* === 4. EXTERIOR LEFT PVC INLET PIPE === */}
        <g id="exterior-inlet-pipe">
          <rect x="0" y="133" width="62" height="16" fill="url(#pvcPipeGrad)" />
          <rect x="42" y="130" width="12" height="22" rx="2" fill="#bac6ce" stroke="#62707a" strokeWidth="1" />
          <rect x="57" y="128" width="7" height="26" rx="1.5" fill="#7c8a94" />
        </g>

        {/* === 5. TOP ZG ULTRASONIC IOT SENSOR BOX & ARMORED CONDUIT === */}
        <g id="zg-sensor-unit">
          {/* Armored conduit curving right into concrete slab */}
          <path
            d="M358 48 H384 Q394 48 394 58 V72"
            fill="none"
            stroke="#2a333d"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M358 48 H384 Q394 48 394 58 V72"
            fill="none"
            stroke="#5a6a78"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* Conduit gland & slab flange */}
          <rect x="387" y="66" width="14" height="6" rx="1" fill="#46535e" />

          {/* Mounting neck through concrete slab */}
          <rect x="300" y="66" width="40" height="26" fill="#171f27" stroke="#3c4b59" strokeWidth="1" />

          {/* Main black ZG housing */}
          <rect
            x="278"
            y="24"
            width="84"
            height="46"
            rx="7"
            fill="url(#sensorBoxGrad)"
            stroke="#566775"
            strokeWidth="1.2"
          />
          {/* Top bezel highlight */}
          <line x1="286" y1="26" x2="354" y2="26" stroke="#7d90a0" strokeWidth="1" opacity="0.65" />

          {/* Drop mark + ZG text */}
          <path
            d="M304 38 C302 42 299 44.5 299 47 a5 5 0 0 0 10 0 C309 44.5 306 42 304 38 Z"
            fill="none"
            stroke="#e8f6fa"
            strokeWidth="1.5"
          />
          <text
            x="327"
            y="49"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="14"
            fontWeight="700"
            className="font-display"
          >
            ZG
          </text>

          {/* Status LED bar (cyan normally, amber on preventive, red on critical) */}
          <rect
            x="312"
            y="59"
            width="16"
            height="4"
            rx="2"
            fill={alertState.accentColor}
          />
        </g>
      </svg>
    </div>
  );
}
