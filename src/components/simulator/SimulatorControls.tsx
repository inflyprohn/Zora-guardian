import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  XOctagon,
} from "lucide-react";
import {
  MAX_CAPACITY_LITERS,
  calculateLiters,
  getCisternAlertState,
} from "./types";

interface SimulatorControlsProps {
  level: number;
  isConsuming: boolean;
  preventiveThreshold: number;
  criticalThreshold: number;
  onSliderChange: (nextLevel: number) => void;
  onSliderCommit: (finalLevel: number) => void;
  onStepAdjust: (delta: number) => void;
  onToggleConsume: () => void;
  onReset: () => void;
}

export function SimulatorControls({
  level,
  isConsuming,
  preventiveThreshold,
  criticalThreshold,
  onSliderChange,
  onSliderCommit,
  onStepAdjust,
  onToggleConsume,
  onReset,
}: SimulatorControlsProps) {
  const liters = calculateLiters(level);
  const formattedLiters = liters.toLocaleString("es-HN");
  const formattedMax = MAX_CAPACITY_LITERS.toLocaleString("es-HN");
  const alertState = getCisternAlertState(level, preventiveThreshold, criticalThreshold);

  const StatusIcon =
    alertState.tone === "critical"
      ? XOctagon
      : alertState.tone === "preventive" || alertState.tone === "moderate"
        ? AlertTriangle
        : alertState.tone === "full"
          ? Droplets
          : CheckCircle2;

  return (
    <div className="space-y-4">
      {/* Capacity & Liters Readout Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#224565] text-xs font-mono tabular-nums text-[#8eaec2]">
        <span>0 L</span>
        <span className="text-sm sm:text-base font-semibold text-white">
          {formattedLiters} L <span className="text-[#6990a8]">/</span> {formattedMax} L
        </span>
        <span>{formattedMax} L</span>
      </div>

      {/* Prominent State & Critical Alert Notification */}
      <div
        role={alertState.tone === "critical" ? "alert" : "status"}
        className={`border p-3.5 flex items-start justify-between gap-3 transition-colors duration-200 ${alertState.bannerBgClass} ${alertState.bannerBorderClass} ${alertState.bannerTextClass}`}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <StatusIcon className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-xs font-bold tracking-wide">
                {alertState.statusLabel}
              </strong>
              <span className="text-xs opacity-75">·</span>
              <span className="text-xs font-medium">{alertState.notificationTitle}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed opacity-95">
              {alertState.notificationMessage}
            </p>
          </div>
        </div>
        <span className="font-mono text-sm font-bold tabular-nums shrink-0">{level}%</span>
      </div>

      {/* Interactive Slider Box */}
      <div className="bg-[#0d2742]/90 border border-[#2b4d6b] p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
          <label htmlFor="cisternLevelRange" className="font-medium text-[#d0e2ec]">
            Ajustar nivel de agua
          </label>
          <strong className="font-mono text-base sm:text-lg font-bold tabular-nums text-[#5de2f7]">
            {level}%
          </strong>
        </div>

        <input
          id="cisternLevelRange"
          type="range"
          min={0}
          max={100}
          step={1}
          value={level}
          onChange={(e) => onSliderChange(Number(e.target.value))}
          onMouseUp={(e) => onSliderCommit(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => onSliderCommit(Number((e.target as HTMLInputElement).value))}
          onKeyUp={(e) => onSliderCommit(Number((e.target as HTMLInputElement).value))}
          className="zora-slider w-full cursor-pointer"
          style={{
            background: `linear-gradient(90deg, #35d1ec ${level}%, #25415c ${level}%)`,
          }}
        />

        <div className="flex justify-between text-xs text-[#89a7ba] mt-2">
          <span>Vacía (0%)</span>
          <span>Llena (100%)</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => onStepAdjust(-10)}
          disabled={level <= 0}
          className="inline-flex items-center justify-center gap-1.5 bg-[#0f2c48] hover:bg-[#173f64] disabled:opacity-45 disabled:cursor-not-allowed border border-[#325b7d] text-white text-xs sm:text-sm font-semibold py-3 px-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#62d8e8]"
        >
          <Minus className="w-4 h-4 text-[#62d8e8]" aria-hidden="true" />
          <span className="tabular-nums">10%</span>
        </button>

        <button
          type="button"
          onClick={() => onStepAdjust(10)}
          disabled={level >= 100}
          className="inline-flex items-center justify-center gap-1.5 bg-[#0f2c48] hover:bg-[#173f64] disabled:opacity-45 disabled:cursor-not-allowed border border-[#325b7d] text-white text-xs sm:text-sm font-semibold py-3 px-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#62d8e8]"
        >
          <Plus className="w-4 h-4 text-[#62d8e8]" aria-hidden="true" />
          <span className="tabular-nums">10%</span>
        </button>

        <button
          type="button"
          onClick={onToggleConsume}
          disabled={level <= 0 && !isConsuming}
          className={`inline-flex items-center justify-center gap-1.5 border text-xs sm:text-sm font-semibold py-3 px-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#62d8e8] ${
            isConsuming
              ? "bg-[#c9e66b] border-[#c9e66b] text-[#071d39]"
              : "bg-[#0f2c48] hover:bg-[#173f64] border-[#325b7d] text-white disabled:opacity-45 disabled:cursor-not-allowed"
          }`}
        >
          {isConsuming ? (
            <>
              <Pause className="w-4 h-4" aria-hidden="true" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-[#62d8e8]" aria-hidden="true" />
              <span>Consumo</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          aria-label="Reiniciar simulación al 80%"
          className="inline-flex items-center justify-center gap-1.5 bg-[#0f2c48] hover:bg-[#173f64] border border-[#325b7d] text-white text-xs sm:text-sm font-semibold py-3 px-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#62d8e8]"
        >
          <RotateCcw className="w-4 h-4 text-[#62d8e8]" aria-hidden="true" />
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
}
