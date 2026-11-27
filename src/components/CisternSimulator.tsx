import { useEffect, useRef, useState } from "react";
import { Droplets, Info } from "lucide-react";
import { ConcreteCisternVisual } from "./simulator/ConcreteCisternVisual";
import { SimulatorControls } from "./simulator/SimulatorControls";
import { MobileAppFrame } from "./simulator/MobileAppFrame";
import {
  AlertNotificationEntry,
  AlertTone,
  DEFAULT_CRITICAL_THRESHOLD,
  DEFAULT_LEVEL,
  DEFAULT_PREVENTIVE_THRESHOLD,
  HistoryEntry,
  HistoryEventType,
  MAX_CAPACITY_LITERS,
  calculateLiters,
  getCisternAlertState,
} from "./simulator/types";

function formatNow(): string {
  return new Date().toLocaleTimeString("es-HN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function CisternSimulator() {
  const [level, setLevel] = useState<number>(DEFAULT_LEVEL);
  const [isConsuming, setIsConsuming] = useState<boolean>(false);
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [consumedSessionLiters, setConsumedSessionLiters] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Shared editable settings (synced between simulator & phone Ajustes tab)
  const [cisternName, setCisternName] = useState<string>("Cisterna Principal");
  const [preventiveThreshold, setPreventiveThreshold] = useState<number>(
    DEFAULT_PREVENTIVE_THRESHOLD
  );
  const [criticalThreshold, setCriticalThreshold] = useState<number>(
    DEFAULT_CRITICAL_THRESHOLD
  );
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const [alertsLog, setAlertsLog] = useState<AlertNotificationEntry[]>(() => {
    const initial = getCisternAlertState(
      DEFAULT_LEVEL,
      DEFAULT_PREVENTIVE_THRESHOLD,
      DEFAULT_CRITICAL_THRESHOLD
    );
    return [
      {
        id: "initial-alert",
        timestamp: formatNow(),
        tone: initial.tone,
        title: initial.shortLabel,
        message: initial.notificationMessage,
        level: DEFAULT_LEVEL,
      },
    ];
  });

  // Track start of manual slider drag or auto-consumption session for clean history entries
  const sliderStartLevelRef = useRef<number>(DEFAULT_LEVEL);
  const consumeStartLevelRef = useRef<number | null>(null);
  const fillTimerRef = useRef<number | null>(null);
  const levelRef = useRef<number>(DEFAULT_LEVEL);
  const lastToneRef = useRef<AlertTone>(
    getCisternAlertState(
      DEFAULT_LEVEL,
      DEFAULT_PREVENTIVE_THRESHOLD,
      DEFAULT_CRITICAL_THRESHOLD
    ).tone
  );
  levelRef.current = level;

  // Record automatic notification whenever alert state changes
  useEffect(() => {
    const currentState = getCisternAlertState(level, preventiveThreshold, criticalThreshold);
    if (currentState.tone !== lastToneRef.current) {
      lastToneRef.current = currentState.tone;
      setAlertsLog((prev) =>
        [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            timestamp: formatNow(),
            tone: currentState.tone,
            title: currentState.shortLabel,
            message: currentState.notificationMessage,
            level,
          },
          ...prev,
        ].slice(0, 25)
      );
    }
  }, [level, preventiveThreshold, criticalThreshold]);

  const appendHistory = (
    previousLevel: number,
    newLevel: number,
    eventType: HistoryEventType
  ) => {
    if (previousLevel === newLevel && eventType !== "Reinicio") return;
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: formatNow(),
      previousLevel,
      newLevel,
      eventType,
      litersAfter: calculateLiters(newLevel),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 30));
  };

  const triggerFillStream = () => {
    setIsFilling(true);
    if (fillTimerRef.current) window.clearTimeout(fillTimerRef.current);
    fillTimerRef.current = window.setTimeout(() => {
      setIsFilling(false);
    }, 950);
  };

  useEffect(() => {
    return () => {
      if (fillTimerRef.current) window.clearTimeout(fillTimerRef.current);
    };
  }, []);

  // Progressive consumption loop
  useEffect(() => {
    if (!isConsuming) return;

    const startLevel = levelRef.current;
    if (consumeStartLevelRef.current === null) {
      consumeStartLevelRef.current = startLevel;
    }

    const stopAtCritical = startLevel > criticalThreshold;

    const timer = window.setInterval(() => {
      const current = levelRef.current;
      if (current <= 0) {
        setIsConsuming(false);
        if (consumeStartLevelRef.current !== null && consumeStartLevelRef.current !== current) {
          appendHistory(consumeStartLevelRef.current, current, "Consumo");
          consumeStartLevelRef.current = null;
        }
        return;
      }

      const next = Math.max(0, current - 1);
      levelRef.current = next;
      sliderStartLevelRef.current = next;
      setLevel(next);
      setConsumedSessionLiters((c) => c + Math.round(MAX_CAPACITY_LITERS / 100));

      if ((stopAtCritical && next <= criticalThreshold) || next <= 0) {
        setIsConsuming(false);
        if (consumeStartLevelRef.current !== null) {
          appendHistory(consumeStartLevelRef.current, next, "Consumo");
          consumeStartLevelRef.current = null;
        }
      }
    }, 380);

    return () => window.clearInterval(timer);
  }, [isConsuming, criticalThreshold]);

  const handleSliderChange = (nextLevel: number) => {
    if (isConsuming) {
      setIsConsuming(false);
      if (consumeStartLevelRef.current !== null) {
        appendHistory(consumeStartLevelRef.current, level, "Consumo");
        consumeStartLevelRef.current = null;
      }
    }
    if (nextLevel > level) {
      triggerFillStream();
    }
    setLevel(nextLevel);
  };

  const handleSliderCommit = (finalLevel: number) => {
    const startVal = sliderStartLevelRef.current;
    if (startVal !== finalLevel) {
      if (finalLevel < startVal) {
        setConsumedSessionLiters(
          (c) => c + calculateLiters(startVal - finalLevel)
        );
      }
      appendHistory(startVal, finalLevel, "Ajuste manual");
      sliderStartLevelRef.current = finalLevel;
    }
  };

  const handleStepAdjust = (delta: number) => {
    if (isConsuming) {
      setIsConsuming(false);
      if (consumeStartLevelRef.current !== null) {
        appendHistory(consumeStartLevelRef.current, level, "Consumo");
        consumeStartLevelRef.current = null;
      }
    }
    const next = Math.max(0, Math.min(100, level + delta));
    if (next === level) return;

    if (delta > 0) {
      triggerFillStream();
      appendHistory(level, next, "Llenado");
    } else {
      setConsumedSessionLiters((c) => c + calculateLiters(level - next));
      appendHistory(level, next, "Consumo");
    }
    setLevel(next);
    sliderStartLevelRef.current = next;
  };

  const handleToggleConsume = () => {
    if (isConsuming) {
      setIsConsuming(false);
      if (consumeStartLevelRef.current !== null && consumeStartLevelRef.current !== level) {
        appendHistory(consumeStartLevelRef.current, level, "Consumo");
      }
      consumeStartLevelRef.current = null;
      sliderStartLevelRef.current = level;
    } else {
      if (level <= 0) return;
      consumeStartLevelRef.current = level;
      setIsConsuming(true);
    }
  };

  const handleReset = () => {
    setIsConsuming(false);
    setIsFilling(false);
    consumeStartLevelRef.current = null;
    const prev = level;
    setLevel(DEFAULT_LEVEL);
    sliderStartLevelRef.current = DEFAULT_LEVEL;
    setConsumedSessionLiters(0);
    appendHistory(prev, DEFAULT_LEVEL, "Reinicio");
  };

  const handleUpdatePreventive = (next: number) => {
    const clamped = Math.max(criticalThreshold + 5, Math.min(45, next));
    setPreventiveThreshold(clamped);
  };

  const handleUpdateCritical = (next: number) => {
    const clamped = Math.max(5, Math.min(preventiveThreshold - 5, next));
    setCriticalThreshold(clamped);
  };

  return (
    <section
      id="simulador"
      className="bg-gradient-to-b from-[#071d39] via-[#061830] to-[#051428] text-white border-b border-[#1c3a58]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-16 lg:py-24">
        {/* Section Intro */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-[#75cce0]">
              <span>03 · Simulador interactivo</span>
              <span className="font-mono tabular-nums text-[#7c9eb3]">03 — 04</span>
            </div>
            <h2 className="mt-4 text-[clamp(2rem,3.5vw,3.15rem)] font-semibold leading-[1.06] tracking-tight text-white text-balance">
              Imagina tener el nivel <span className="text-[#6fd1dc]">a la vista</span>.
            </h2>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-[#b3c6d2] max-w-[380px]">
            Mueve el control o prueba el consumo automático para ver cómo cambia el agua en la
            cisterna y en la aplicación móvil sincronizada.
          </p>
        </div>

        {/* Main Interactive Simulator Grid: Cistern + Controls (Left) & Proportional Mobile App (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Concrete Cistern Stage & Controls */}
          <div className="lg:col-span-7 bg-[#08203c] border border-[#244666] p-5 sm:p-6 flex flex-col justify-between gap-5">
            {/* Header matching reference */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-[#3aa6cf]/50 bg-[#0d2d4e] flex items-center justify-center text-[#59d6ee]">
                  <Droplets className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                    {cisternName.trim() || "Cisterna principal"}
                  </h3>
                  <p className="text-xs text-[#9cb8c9]">Monitoreo en tiempo real</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 border border-[#2b5275] bg-[#0b2643] px-3.5 py-1.5 text-xs font-medium text-[#cbe4f0]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: !isOnline
                      ? "#94a3b8"
                      : isConsuming
                        ? "#fbbf24"
                        : "#22c55e",
                  }}
                />
                <span>
                  {!isOnline
                    ? "Modo sin conexión"
                    : isConsuming
                      ? "Consumo activo"
                      : "Simulación local"}
                </span>
              </div>
            </div>

            {/* Interactive Cutaway Concrete Cistern */}
            <ConcreteCisternVisual
              level={level}
              isFilling={isFilling}
              isConsuming={isConsuming}
            />

            {/* Controls + Alerts */}
            <SimulatorControls
              level={level}
              isConsuming={isConsuming}
              preventiveThreshold={preventiveThreshold}
              criticalThreshold={criticalThreshold}
              onSliderChange={handleSliderChange}
              onSliderCommit={handleSliderCommit}
              onStepAdjust={handleStepAdjust}
              onToggleConsume={handleToggleConsume}
              onReset={handleReset}
            />

            <div className="flex items-start gap-2.5 text-xs text-[#8ba8ba]">
              <Info className="w-4 h-4 text-[#62d8e8] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Simulación local interactiva. Todos los valores, ondas ultrasónicas y alertas se
                calculan en el navegador; consulta el historial completo en la aplicación móvil.
              </span>
            </div>
          </div>

          {/* Right: Synchronized Zora Guardian Mobile App matching reference design */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <MobileAppFrame
              level={level}
              isConsuming={isConsuming}
              consumedSessionLiters={consumedSessionLiters}
              history={history}
              alertsLog={alertsLog}
              cisternName={cisternName}
              preventiveThreshold={preventiveThreshold}
              criticalThreshold={criticalThreshold}
              isOnline={isOnline}
              onChangeCisternName={setCisternName}
              onChangePreventiveThreshold={handleUpdatePreventive}
              onChangeCriticalThreshold={handleUpdateCritical}
              onToggleOnline={() => setIsOnline((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
