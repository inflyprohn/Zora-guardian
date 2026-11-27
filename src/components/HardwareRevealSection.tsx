import { useCallback, useEffect, useRef, useState } from "react";
import { Cpu } from "lucide-react";

const CLOSED_SENSOR_URL =
  `${import.meta.env.BASE_URL}assets/aistudio/Render_detallado_del_dispositivo_Zora_Guardian_6fd100c4.png`;
const OPEN_SENSOR_URL =
  `${import.meta.env.BASE_URL}assets/aistudio/Mo_dulo_ESP32_abierto_con_sensor_ultraso_nico_43e9a077.png`;

interface ComponentHotspot {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  placement: "top" | "bottom" | "left";
}

const COMPONENT_HOTSPOTS: ComponentHotspot[] = [
  {
    id: "unidad",
    label: "Unidad de procesamiento",
    xPct: 39,
    yPct: 34,
    placement: "top",
  },
  {
    id: "placa",
    label: "Placa electrónica",
    xPct: 64,
    yPct: 36,
    placement: "top",
  },
  {
    id: "alimentacion",
    label: "Sistema de alimentación",
    xPct: 50,
    yPct: 48,
    placement: "bottom",
  },
  {
    id: "conectividad",
    label: "Conectividad inalámbrica",
    xPct: 83,
    yPct: 26,
    placement: "left",
  },
  {
    id: "ultrasonico",
    label: "Módulo ultrasónico",
    xPct: 47.5,
    yPct: 83.5,
    placement: "bottom",
  },
];

export function HardwareRevealSection() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingCoordsRef = useRef<{ x: number; y: number; r: number } | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);
  const [closedFailed, setClosedFailed] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);

  const findNearestHotspot = useCallback(
    (x: number, y: number, width: number, height: number, radius: number): string | null => {
      const maxDistance = Math.max(radius * 0.92, 95);
      let closestId: string | null = null;
      let minDist = Infinity;

      for (const spot of COMPONENT_HOTSPOTS) {
        const hx = (spot.xPct / 100) * width;
        const hy = (spot.yPct / 100) * height;
        const dist = Math.hypot(x - hx, y - hy);
        if (dist <= maxDistance && dist < minDist) {
          minDist = dist;
          closestId = spot.id;
        }
      }
      return closestId;
    },
    []
  );

  const flushPointerFrame = useCallback(() => {
    rafRef.current = null;
    const stage = stageRef.current;
    const coords = pendingCoordsRef.current;
    if (!stage || !coords) return;

    stage.style.setProperty("--scan-x", `${coords.x.toFixed(1)}px`);
    stage.style.setProperty("--scan-y", `${coords.y.toFixed(1)}px`);
    stage.style.setProperty("--scan-r", `${coords.r.toFixed(0)}px`);
  }, []);

  const updatePointerPosition = useCallback(
    (clientX: number, clientY: number) => {
      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      const radius = Math.round(Math.max(104, Math.min(132, rect.width * 0.3)));

      pendingCoordsRef.current = { x, y, r: radius };
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(flushPointerFrame);
      }

      const nearestId = findNearestHotspot(x, y, rect.width, rect.height, radius);
      setActiveComponentId((prev) => (prev === nearestId ? prev : nearestId));
    },
    [findNearestHotspot, flushPointerFrame]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    setIsActive(true);
    updatePointerPosition(e.clientX, e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable
      }
    }
    setIsActive(true);
    updatePointerPosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive && e.pointerType === "touch") return;
    if (!isActive) setIsActive(true);
    updatePointerPosition(e.clientX, e.clientY);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" && e.currentTarget.hasPointerCapture(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if already released
      }
    }
    setIsActive(false);
    setActiveComponentId(null);
  };

  const activeSpot = COMPONENT_HOTSPOTS.find((spot) => spot.id === activeComponentId) ?? null;

  const revealMask =
    "radial-gradient(circle var(--scan-r) at var(--scan-x) var(--scan-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.98) 68%, rgba(0,0,0,0.52) 86%, rgba(0,0,0,0) 100%)";

  const inverseClosedMask =
    "radial-gradient(circle var(--scan-r) at var(--scan-x) var(--scan-y), rgba(0,0,0,0) 0%, rgba(0,0,0,0.16) 66%, rgba(0,0,0,0.78) 86%, rgba(0,0,0,1) 100%)";

  const edgeBlurMask =
    "radial-gradient(circle var(--scan-r) at var(--scan-x) var(--scan-y), rgba(0,0,0,0) 56%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.3) 94%, rgba(0,0,0,0) 100%)";

  return (
    <section
      id="interior"
      className="scroll-mt-[76px] bg-[#f5f7f9] text-[#091c32] border-b border-[#dde4ec]"
      aria-labelledby="hardware-reveal-title"
    >
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-20 lg:py-28 flex flex-col items-center">
        <div
          ref={stageRef}
          onPointerEnter={handlePointerEnter}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerEnd}
          style={
            {
              "--scan-x": "50%",
              "--scan-y": "42%",
              "--scan-r": "124px",
            } as React.CSSProperties
          }
          className="relative w-full max-w-[380px] sm:max-w-[430px] aspect-[2/3] select-none touch-none cursor-crosshair"
        >
          {/* Soft floor studio shadow beneath the ultrasonic module */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 bottom-[3.5%] -translate-x-1/2 w-[56%] h-6 rounded-full bg-[#091c32]/15 blur-xl"
          />

          {/* Layer 1: Closed exterior housing (fades inside scan aperture so internals show cleanly) */}
          {!closedFailed ? (
            <img
              src={CLOSED_SENSOR_URL}
              alt="Sensor Zora Guardian con carcasa cerrada y logotipo frontal"
              draggable={false}
              referrerPolicy="no-referrer"
              onError={() => setClosedFailed(true)}
              style={
                isActive
                  ? {
                      maskImage: inverseClosedMask,
                      WebkitMaskImage: inverseClosedMask,
                    }
                  : undefined
              }
              className="pointer-events-none absolute inset-0 w-full h-full object-contain drop-shadow-[0_22px_36px_rgba(7,29,57,0.12)] transition-[opacity] duration-200"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <Cpu className="w-10 h-10 text-[#0084ff] mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-[#091c32]">Sensor Zora Guardian</p>
            </div>
          )}

          {/* Layer 2: Blurred transition boundary on the outer casing edge */}
          {!closedFailed && (
            <img
              src={CLOSED_SENSOR_URL}
              alt=""
              aria-hidden="true"
              draggable={false}
              referrerPolicy="no-referrer"
              style={{
                maskImage: edgeBlurMask,
                WebkitMaskImage: edgeBlurMask,
              }}
              className={`pointer-events-none absolute inset-0 w-full h-full object-contain blur-[4px] transition-opacity duration-200 ${
                isActive ? "opacity-85" : "opacity-0"
              }`}
            />
          )}

          {/* Layer 3: Exposed internal hardware (ESP32, PCB, battery, wiring, ultrasonic module) */}
          {!openFailed && (
            <img
              src={OPEN_SENSOR_URL}
              alt="Componentes internos del sensor Zora Guardian: placa electrónica, módulo ESP32, batería y transductor ultrasónico"
              draggable={false}
              referrerPolicy="no-referrer"
              onError={() => setOpenFailed(true)}
              style={{
                maskImage: revealMask,
                WebkitMaskImage: revealMask,
              }}
              className={`pointer-events-none absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_34px_rgba(7,29,57,0.12)] transition-opacity duration-200 ease-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Layer 4: Optical scan window ring, illumination and subtle scan line */}
          <div
            aria-hidden="true"
            style={{
              width: "calc(var(--scan-r) * 2)",
              height: "calc(var(--scan-r) * 2)",
              transform:
                "translate3d(calc(var(--scan-x) - var(--scan-r)), calc(var(--scan-y) - var(--scan-r)), 0)",
              boxShadow:
                "0 0 24px rgba(0, 132, 255, 0.24), inset 0 0 22px rgba(56, 189, 248, 0.14)",
              background:
                "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(0, 132, 255, 0.02) 65%, transparent 100%)",
            }}
            className={`pointer-events-none absolute top-0 left-0 rounded-full border border-[#0084ff]/75 overflow-hidden transition-opacity duration-200 ease-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Subtle horizontal scanning line inside aperture */}
            <div className="absolute inset-0 animate-zora-scan">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#0084ff]/80 to-transparent shadow-[0_0_8px_rgba(0,132,255,0.65)]" />
            </div>
          </div>

          {/* Layer 5: Discrete proximity indicator for internal components */}
          {isActive && activeSpot && (
            <div
              key={activeSpot.id}
              style={{
                left: `${activeSpot.xPct}%`,
                top: `${activeSpot.yPct}%`,
              }}
              className="pointer-events-none absolute z-20"
            >
              <span
                aria-hidden="true"
                className="block w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0084ff] ring-4 ring-[#0084ff]/20"
              />
              <div
                className={`absolute whitespace-nowrap bg-white/95 backdrop-blur-md border border-[#0084ff]/30 px-2.5 py-1 text-[11px] font-medium tracking-tight text-[#08203a] shadow-[0_6px_18px_rgba(8,32,58,0.12)] ${
                  activeSpot.placement === "top"
                    ? "left-0 bottom-0 -translate-x-1/2 -translate-y-3"
                    : activeSpot.placement === "left"
                      ? "right-0 top-0 -translate-x-3 -translate-y-1/2"
                      : "left-0 top-0 -translate-x-1/2 translate-y-3"
                }`}
              >
                {activeSpot.label}
              </div>
            </div>
          )}
        </div>

        {/* Minimalist instruction directly below the sensor */}
        <div className="mt-8 text-center max-w-[440px]">
          <h2
            id="hardware-reveal-title"
            className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#071d39] text-balance"
          >
            Explora el interior de Zora Guardian
          </h2>
          <p className="mt-2 text-sm text-[#526577]">
            Desliza el cursor o tu dedo para descubrir su tecnología.
          </p>
        </div>
      </div>
    </section>
  );
}
