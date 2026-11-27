import { useEffect, useId, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  Droplet,
  Home,
  Minus,
  Plus,
  RotateCcw,
  Settings,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  XOctagon,
} from "lucide-react";
import {
  AlertNotificationEntry,
  HistoryEntry,
  MAX_CAPACITY_LITERS,
  calculateLiters,
  getCisternAlertState,
} from "./types";

type PhoneTab = "inicio" | "consumo" | "alertas" | "ajustes";
type ConsumptionPeriod = "dia" | "semana" | "mes";

const PHONE_FRAME_URL =
  `${import.meta.env.BASE_URL}assets/aistudio/Smartphone_con_interfaz_Zora_Guardian_2ad44f8d.png`;

interface MobileAppFrameProps {
  level: number;
  isConsuming: boolean;
  consumedSessionLiters: number;
  history: HistoryEntry[];
  alertsLog: AlertNotificationEntry[];
  cisternName: string;
  preventiveThreshold: number;
  criticalThreshold: number;
  isOnline: boolean;
  onChangeCisternName: (name: string) => void;
  onChangePreventiveThreshold: (value: number) => void;
  onChangeCriticalThreshold: (value: number) => void;
  onToggleOnline: () => void;
}

const GAUGE_RADIUS = 74;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

export function MobileAppFrame({
  level,
  isConsuming,
  consumedSessionLiters,
  history,
  alertsLog,
  cisternName,
  preventiveThreshold,
  criticalThreshold,
  isOnline,
  onChangeCisternName,
  onChangePreventiveThreshold,
  onChangeCriticalThreshold,
  onToggleOnline,
}: MobileAppFrameProps) {
  const [activeTab, setActiveTab] = useState<PhoneTab>("inicio");
  const [period, setPeriod] = useState<ConsumptionPeriod>("dia");
  const [seenAlertsCount, setSeenAlertsCount] = useState<number>(alertsLog.length);

  const uid = useId().replace(/:/g, "");
  const arcGradientId = `zg-arc-${uid}`;
  const waterGradientId = `zg-water-${uid}`;
  const waterClipId = `zg-clip-${uid}`;

  useEffect(() => {
    if (activeTab === "alertas") {
      setSeenAlertsCount(alertsLog.length);
    }
  }, [activeTab, alertsLog.length]);

  const unreadAlertCount =
    activeTab === "alertas" ? 0 : Math.max(0, alertsLog.length - seenAlertsCount);

  const liters = calculateLiters(level);
  const formattedLiters = liters.toLocaleString("es-HN");
  const formattedCapacity = MAX_CAPACITY_LITERS.toLocaleString("es-HN");
  const formattedConsumed = consumedSessionLiters.toLocaleString("es-HN");
  const last24hLiters = (1250 + consumedSessionLiters).toLocaleString("es-HN");

  const alertState = getCisternAlertState(
    level,
    preventiveThreshold,
    criticalThreshold
  );

  const StatusIcon =
    alertState.tone === "critical"
      ? XOctagon
      : alertState.tone === "preventive" || alertState.tone === "moderate"
        ? AlertTriangle
        : CheckCircle2;

  // Water height mapping inside inner circular gauge (r = 62 -> top 28, bottom 152)
  const waterTranslateY = 152 - (level / 100) * 124;

  // Gauge arc gradient endpoints dynamically follow alert state while preserving reference emerald-cyan-blue at normal/full
  const arcColors =
    alertState.tone === "critical"
      ? { start: "#f97316", mid: "#ef4444", end: "#dc2626" }
      : alertState.tone === "preventive"
        ? { start: "#fde047", mid: "#f59e0b", end: "#d97706" }
        : alertState.tone === "moderate"
          ? { start: "#67e8f9", mid: "#38bdf8", end: "#0284c7" }
          : { start: "#00f59b", mid: "#2ee6ff", end: "#008cff" };

  const periodData: Record<
    ConsumptionPeriod,
    {
      subtitle: string;
      bars: { label: string; liters: number }[];
    }
  > = {
    dia: {
      subtitle: "Últimas 24 h por tramo",
      bars: [
        { label: "04h", liters: 150 },
        { label: "08h", liters: 260 },
        { label: "12h", liters: 310 },
        { label: "16h", liters: 240 },
        { label: "20h", liters: 290 },
        { label: "Hoy", liters: Math.max(90, consumedSessionLiters) },
      ],
    },
    semana: {
      subtitle: "Consumo últimos 7 días",
      bars: [
        { label: "L", liters: 820 },
        { label: "M", liters: 760 },
        { label: "X", liters: 940 },
        { label: "J", liters: 880 },
        { label: "V", liters: 1050 },
        { label: "S", liters: 1170 },
        { label: "H", liters: 640 + consumedSessionLiters },
      ],
    },
    mes: {
      subtitle: "Consumo mensual",
      bars: [
        { label: "S1", liters: 5800 },
        { label: "S2", liters: 6150 },
        { label: "S3", liters: 5900 },
        { label: "S4", liters: 5550 + consumedSessionLiters },
      ],
    },
  };

  const activePeriodData = periodData[period];
  const maxBarLiters = Math.max(...activePeriodData.bars.map((b) => b.liters), 1);

  return (
    <div className="relative w-full max-w-[350px] lg:max-w-[400px] mx-auto aspect-[910/1727]">
      {/* Authentic Metallic + Black Smartphone Frame Reference PNG */}
      <img
        src={PHONE_FRAME_URL}
        alt="Smartphone frontal mostrando la aplicación interactiva Zora Guardian"
        referrerPolicy="no-referrer"
        className="pointer-events-none select-none absolute inset-0 z-10 w-full h-full object-fill"
      />

      {/* Interactive App Screen aligned precisely inside device screen bounds */}
      <div
        className="absolute z-20 flex flex-col justify-between overflow-hidden rounded-[34px] text-white"
        style={{
          left: "9.56%",
          right: "9.45%",
          top: "4.40%",
          bottom: "4.86%",
          background:
            "linear-gradient(180deg, #041e44 0%, #031634 52%, #020e23 100%)",
        }}
      >
        {/* Top Hardware Speaker/Camera Notch matching reference */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-[53%] h-[22px] bg-[#06080b] rounded-b-[15px] flex items-center justify-center gap-2.5">
            <span className="w-9 h-[3.5px] rounded-full bg-[#22262e]" />
            <span className="w-2 h-2 rounded-full bg-[#152d4d]" />
          </div>
        </div>

        {/* Main Scrollable Screen Body */}
        <div className="px-4 pt-2.5 flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* App Top Bar: Brand + Live Connection Indicator */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#1c416e] shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <svg
                viewBox="0 0 36 42"
                aria-hidden="true"
                className="w-5 h-5 shrink-0"
              >
                <path
                  d="M18 2C12.5 11.5 3.5 19.8 3.5 27.5a14.5 14.5 0 0 0 29 0C32.5 19.8 23.5 11.5 18 2Z"
                  fill="none"
                  stroke="#0099ff"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 22c4-3.5 10-3.5 14 0M13.5 26c2.5-2.2 6.5-2.2 9 0"
                  fill="none"
                  stroke="#5ce1f5"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M7.5 30.5c3.5 2 6.8-1.5 10.5 0s7 1.8 10.5-.5a11 11 0 0 1-21 .5Z"
                  fill="#0099ff"
                />
              </svg>
              <span className="font-display font-bold text-[15px] tracking-tight text-white truncate">
                Zora Guardian
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#e0edf8] shrink-0">
              <span
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: !isOnline
                    ? "#94a3b8"
                    : isConsuming
                      ? "#fbbf24"
                      : "#22c55e",
                  boxShadow: isOnline
                    ? isConsuming
                      ? "0 0 8px rgba(251, 191, 36, 0.85)"
                      : "0 0 8px rgba(34, 197, 94, 0.85)"
                    : "none",
                }}
              />
              <span>
                {!isOnline
                  ? "Sin conexión"
                  : isConsuming
                    ? "En línea · Uso"
                    : "Simulación local"}
              </span>
            </div>
          </div>

          {/* Cistern Title + Capacity Row */}
          <div className="flex items-baseline justify-between gap-2 pt-2.5 pb-1 shrink-0">
            <h4 className="font-display font-semibold text-[17px] leading-tight text-white truncate">
              {cisternName.trim() || "Cisterna Principal"}
            </h4>
            <span className="font-sans text-[12px] font-medium tabular-nums text-[#dce9f5] shrink-0">
              {formattedCapacity} L
            </span>
          </div>

          {/* TAB 1: INICIO */}
          {activeTab === "inicio" && (
            <div className="flex-1 flex flex-col justify-between py-2 gap-2.5 animate-[fadeIn_180ms_ease-out]">
              {/* Dynamic Circular Water Level Gauge */}
              <div className="relative w-[172px] h-[172px] mx-auto shrink-0">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 180 180"
                  aria-label="Medidor circular dinámico de nivel de agua"
                >
                  <defs>
                    <linearGradient id={arcGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={arcColors.start} />
                      <stop offset="52%" stopColor={arcColors.mid} />
                      <stop offset="100%" stopColor={arcColors.end} />
                    </linearGradient>

                    <linearGradient id={waterGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#20c6ff" stopOpacity="0.95" />
                      <stop offset="45%" stopColor="#008cff" stopOpacity="0.96" />
                      <stop offset="100%" stopColor="#004d9e" stopOpacity="0.98" />
                    </linearGradient>

                    <clipPath id={waterClipId}>
                      <circle cx="90" cy="90" r="61" />
                    </clipPath>
                  </defs>

                  {/* Inner Deep Navy Cavity */}
                  <circle cx="90" cy="90" r="61" fill="#031634" />

                  {/* Animated Rising/Falling Water Pool inside Circular Gauge */}
                  <g clipPath={`url(#${waterClipId})`}>
                    <g
                      style={{
                        transform: `translateY(${waterTranslateY}px)`,
                        transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      {/* Back wave layer */}
                      <g className="animate-wave-reverse">
                        <path
                          d="M0,4 C40,-4 78,10 117,4 C156,-2 195,10 234,4 C273,-2 312,10 351,4 C390,-2 429,10 468,4 C507,-2 546,10 585,4 C624,-2 663,10 702,4 L702,160 L0,160 Z"
                          fill="#006bd6"
                          opacity="0.55"
                        />
                      </g>
                      {/* Front illuminated wave layer */}
                      <g className="animate-wave-forward">
                        <path
                          d="M0,6 C39,12 78,-2 117,6 C156,14 195,-2 234,6 C273,14 312,-2 351,6 C390,14 429,-2 468,6 C507,14 546,-2 585,6 C624,14 663,-2 702,6 L702,160 L0,160 Z"
                          fill={`url(#${waterGradientId})`}
                        />
                        <path
                          d="M0,6 C39,12 78,-2 117,6 C156,14 195,-2 234,6 C273,14 312,-2 351,6 C390,14 429,-2 468,6 C507,14 546,-2 585,6 C624,14 663,-2 702,6"
                          fill="none"
                          stroke="#7ce6ff"
                          strokeWidth="1.8"
                          opacity="0.7"
                        />
                      </g>
                    </g>
                  </g>

                  {/* Outer Track Ring */}
                  <circle
                    cx="90"
                    cy="90"
                    r={GAUGE_RADIUS}
                    fill="none"
                    stroke="#0d2b52"
                    strokeWidth="11"
                  />

                  {/* Animated Progress Arc */}
                  <circle
                    cx="90"
                    cy="90"
                    r={GAUGE_RADIUS}
                    fill="none"
                    stroke={`url(#${arcGradientId})`}
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray={GAUGE_CIRCUMFERENCE}
                    strokeDashoffset={GAUGE_CIRCUMFERENCE * (1 - level / 100)}
                    transform="rotate(-90 90 90)"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                {/* Centered Percentage & Label */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <strong className="font-display text-[33px] font-bold tabular-nums tracking-tight text-white leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                    {level}%
                  </strong>
                  <span className="mt-1 text-[11.5px] font-medium text-[#e1eef8] drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]">
                    Nivel actual
                  </span>
                </div>
              </div>

              {/* Telemetry Summary Card matching reference */}
              <div className="bg-[#07264d]/85 border border-[#1d4b7a]/80 rounded-[13px] px-3.5 py-2 divide-y divide-[#163d69]/75 text-[12px]">
                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[#d4e5f4]">
                    <Droplet className="w-3.5 h-3.5 text-[#dcebfb]" aria-hidden="true" />
                    <span>Litros disponibles</span>
                  </span>
                  <strong className="font-sans font-bold tabular-nums text-white">
                    {formattedLiters} L
                  </strong>
                </div>

                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[#d4e5f4]">
                    <Activity className="w-3.5 h-3.5 text-[#dcebfb]" aria-hidden="true" />
                    <span>Consumo simulado</span>
                  </span>
                  <strong className="font-sans font-bold tabular-nums text-white">
                    {formattedConsumed} L
                  </strong>
                </div>

                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[#d4e5f4]">
                    <Bell className="w-3.5 h-3.5 text-[#dcebfb]" aria-hidden="true" />
                    <span>Estado</span>
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors duration-300 ${alertState.phonePillClass}`}
                  >
                    {alertState.shortLabel}
                  </span>
                </div>
              </div>

              {/* Status Banner Card matching reference */}
              <div
                className={`rounded-[13px] border px-3 py-2.5 flex items-start gap-2.5 text-[11px] transition-all duration-300 ${alertState.phoneCardClass}`}
              >
                <StatusIcon className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <strong className="block font-semibold text-white">
                    {alertState.notificationTitle}
                  </strong>
                  <p className="mt-0.5 text-[10.5px] leading-snug opacity-95">
                    {alertState.notificationMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONSUMO */}
          {activeTab === "consumo" && (
            <div className="flex-1 flex flex-col py-2.5 gap-2.5 min-h-0 animate-[fadeIn_180ms_ease-out]">
              {/* Acumulado & Últimas 24h */}
              <div className="grid grid-cols-2 gap-2 shrink-0">
                <div className="bg-[#07264d]/85 border border-[#1d4b7a]/80 rounded-[11px] p-2.5">
                  <span className="block text-[10px] text-[#9ec0dc]">Consumo acumulado</span>
                  <strong className="mt-0.5 block font-mono text-[13px] tabular-nums text-white">
                    {formattedConsumed} L
                  </strong>
                </div>
                <div className="bg-[#07264d]/85 border border-[#1d4b7a]/80 rounded-[11px] p-2.5">
                  <span className="block text-[10px] text-[#9ec0dc]">Últimas 24 horas</span>
                  <strong className="mt-0.5 block font-mono text-[13px] tabular-nums text-[#5ce1f5]">
                    {last24hLiters} L
                  </strong>
                </div>
              </div>

              {/* Period Toggle + Bar Chart */}
              <div className="bg-[#07264d]/85 border border-[#1d4b7a]/80 rounded-[12px] p-2.5 shrink-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10.5px] font-medium text-[#d4e5f4]">
                    {activePeriodData.subtitle}
                  </span>
                  <div
                    className="inline-flex bg-[#041731] border border-[#1a3f68] rounded-[7px] p-0.5"
                    role="group"
                    aria-label="Periodo de consumo"
                  >
                    {(
                      [
                        { id: "dia", label: "Día" },
                        { id: "semana", label: "Sem" },
                        { id: "mes", label: "Mes" },
                      ] as const
                    ).map((item) => {
                      const active = period === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPeriod(item.id)}
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-[5px] transition-colors ${
                            active
                              ? "bg-[#008cff] text-white"
                              : "text-[#8eb2cf] hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-20 flex items-end justify-between gap-1.5 pt-1">
                  {activePeriodData.bars.map((bar) => {
                    const heightPct = Math.max(
                      14,
                      Math.round((bar.liters / maxBarLiters) * 100)
                    );
                    return (
                      <div
                        key={bar.label}
                        className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                      >
                        <span className="font-mono text-[8px] tabular-nums text-[#9ec0dc]">
                          {bar.liters >= 1000
                            ? `${(bar.liters / 1000).toFixed(1)}k`
                            : bar.liters}
                        </span>
                        <div
                          className="w-full rounded-t-[3px] transition-all duration-300"
                          style={{
                            height: `${heightPct * 0.68}%`,
                            background:
                              "linear-gradient(180deg, #2ee6ff 0%, #008cff 100%)",
                          }}
                        />
                        <span className="text-[9px] font-medium text-[#c5daec]">
                          {bar.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Historial de variaciones del nivel */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#d4e5f4] shrink-0">
                <span>Variaciones del nivel</span>
                <span className="font-mono text-[10px] tabular-nums text-[#5ce1f5]">
                  {history.length} {history.length === 1 ? "evento" : "eventos"}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#062042]/80 border border-[#193e68] rounded-[11px] px-2.5 divide-y divide-[#14355a]">
                {history.length === 0 ? (
                  <p className="text-[10.5px] text-[#8eb2cf] py-5 text-center leading-relaxed">
                    Ajusta la cisterna o activa Consumo para ver el historial en tiempo real.
                  </p>
                ) : (
                  history.map((item) => {
                    const delta = item.newLevel - item.previousLevel;
                    const EventIcon =
                      item.eventType === "Llenado"
                        ? ArrowUpRight
                        : item.eventType === "Consumo"
                          ? ArrowDownRight
                          : item.eventType === "Reinicio"
                            ? RotateCcw
                            : SlidersHorizontal;

                    return (
                      <div
                        key={item.id}
                        className="py-2 flex items-center justify-between gap-2 text-[10.5px]"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 font-semibold text-white">
                            <EventIcon
                              className={`w-3 h-3 shrink-0 ${
                                item.eventType === "Llenado"
                                  ? "text-[#22c55e]"
                                  : item.eventType === "Consumo"
                                    ? "text-[#fbbf24]"
                                    : "text-[#38bdf8]"
                              }`}
                              aria-hidden="true"
                            />
                            <span className="truncate">{item.eventType}</span>
                          </div>
                          <span className="block font-mono text-[9px] text-[#8ab0cc] tabular-nums">
                            {item.timestamp}
                          </span>
                        </div>

                        <div className="text-right font-mono tabular-nums shrink-0">
                          <div className="font-semibold text-white">
                            {item.previousLevel}% → {item.newLevel}%{" "}
                            <span
                              className={
                                delta > 0
                                  ? "text-[#22c55e]"
                                  : delta < 0
                                    ? "text-[#fbbf24]"
                                    : "text-[#94a3b8]"
                              }
                            >
                              ({delta > 0 ? `+${delta}%` : `${delta}%`})
                            </span>
                          </div>
                          <div className="text-[9px] text-[#5ce1f5]">
                            {item.litersAfter.toLocaleString("es-HN")} L
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ALERTAS */}
          {activeTab === "alertas" && (
            <div className="flex-1 flex flex-col py-2.5 gap-2.5 min-h-0 animate-[fadeIn_180ms_ease-out]">
              {/* Current Active Notification Banner */}
              <div
                className={`rounded-[12px] border p-2.5 flex items-start gap-2 text-[11px] shrink-0 transition-all duration-300 ${alertState.phoneCardClass}`}
              >
                <StatusIcon className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="block font-semibold text-white">
                    {alertState.statusLabel}
                  </strong>
                  <p className="mt-0.5 text-[10.5px] leading-snug opacity-95">
                    {alertState.notificationMessage}
                  </p>
                </div>
              </div>

              {/* Notification History List */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#d4e5f4] shrink-0">
                <span>Historial de notificaciones</span>
                <span className="font-mono text-[10px] tabular-nums text-[#5ce1f5]">
                  {alertsLog.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#062042]/80 border border-[#193e68] rounded-[11px] px-2.5 divide-y divide-[#14355a]">
                {alertsLog.map((entry) => {
                  const dotColor =
                    entry.tone === "critical"
                      ? "#ef4444"
                      : entry.tone === "preventive"
                        ? "#f59e0b"
                        : entry.tone === "moderate"
                          ? "#38bdf8"
                          : "#22c55e";
                  return (
                    <div key={entry.id} className="py-2 flex items-start gap-2 text-[10.5px]">
                      <span
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: dotColor }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="font-semibold text-white truncate">
                            {entry.title}
                          </strong>
                          <span className="font-mono text-[9px] tabular-nums text-[#8ab0cc] shrink-0">
                            {entry.timestamp} · {entry.level}%
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-[#bfd6e8] leading-snug">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: AJUSTES */}
          {activeTab === "ajustes" && (
            <div className="flex-1 flex flex-col py-2.5 gap-2.5 overflow-y-auto animate-[fadeIn_180ms_ease-out]">
              <div className="bg-[#07264d]/85 border border-[#1d4b7a]/80 rounded-[12px] p-3 space-y-2.5 text-[11.5px]">
                {/* Nombre de la cisterna */}
                <div>
                  <label
                    htmlFor="zg-cistern-name"
                    className="block text-[10px] text-[#9ec0dc] mb-1"
                  >
                    Nombre de la cisterna
                  </label>
                  <input
                    id="zg-cistern-name"
                    type="text"
                    maxLength={28}
                    value={cisternName}
                    onChange={(e) => onChangeCisternName(e.target.value)}
                    className="w-full bg-[#041834] border border-[#235285] rounded-[8px] px-2.5 py-1.5 text-xs font-medium text-white focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>

                {/* Capacidad máxima */}
                <div className="flex items-center justify-between pt-2 border-t border-[#163d69]">
                  <span className="text-[#c5daec]">Capacidad máxima</span>
                  <span className="font-mono font-semibold tabular-nums text-white">
                    10,000 litros
                  </span>
                </div>

                {/* Umbral preventiva */}
                <div className="flex items-center justify-between pt-2 border-t border-[#163d69]">
                  <span className="text-[#c5daec]">Alerta preventiva</span>
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Reducir umbral preventivo"
                      onClick={() => onChangePreventiveThreshold(preventiveThreshold - 5)}
                      className="w-6 h-6 rounded-[6px] bg-[#0a2f5c] hover:bg-[#11427d] border border-[#25598f] flex items-center justify-center active:scale-95"
                    >
                      <Minus className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <span className="w-9 text-center font-mono font-semibold tabular-nums text-[#fbbf24]">
                      ≤{preventiveThreshold}%
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar umbral preventivo"
                      onClick={() => onChangePreventiveThreshold(preventiveThreshold + 5)}
                      className="w-6 h-6 rounded-[6px] bg-[#0a2f5c] hover:bg-[#11427d] border border-[#25598f] flex items-center justify-center active:scale-95"
                    >
                      <Plus className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Umbral crítica */}
                <div className="flex items-center justify-between pt-2 border-t border-[#163d69]">
                  <span className="text-[#c5daec]">Alerta crítica</span>
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Reducir umbral crítico"
                      onClick={() => onChangeCriticalThreshold(criticalThreshold - 5)}
                      className="w-6 h-6 rounded-[6px] bg-[#0a2f5c] hover:bg-[#11427d] border border-[#25598f] flex items-center justify-center active:scale-95"
                    >
                      <Minus className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <span className="w-9 text-center font-mono font-semibold tabular-nums text-[#f87171]">
                      ≤{criticalThreshold}%
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar umbral crítico"
                      onClick={() => onChangeCriticalThreshold(criticalThreshold + 5)}
                      className="w-6 h-6 rounded-[6px] bg-[#0a2f5c] hover:bg-[#11427d] border border-[#25598f] flex items-center justify-center active:scale-95"
                    >
                      <Plus className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Estado de conexión simulada */}
                <div className="flex items-center justify-between pt-2 border-t border-[#163d69]">
                  <span className="inline-flex items-center gap-1.5 text-[#c5daec]">
                    {isOnline ? (
                      <Wifi className="w-3.5 h-3.5 text-[#22c55e]" aria-hidden="true" />
                    ) : (
                      <WifiOff className="w-3.5 h-3.5 text-[#94a3b8]" aria-hidden="true" />
                    )}
                    <span>Conexión simulada</span>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOnline}
                    onClick={onToggleOnline}
                    className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-colors active:scale-95 ${
                      isOnline
                        ? "bg-[#16a34a] text-white"
                        : "bg-[#1e3a5f] text-[#cbd5e1]"
                    }`}
                  >
                    {isOnline ? "En línea" : "Pausada"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Dock Navigation matching reference dark rounded bar */}
        <div className="px-3.5 pb-3 pt-1.5 shrink-0">
          <div
            className="bg-[#082447]/95 border border-[#1a4778]/80 rounded-[18px] px-1.5 py-2 grid grid-cols-4 gap-1"
            role="tablist"
            aria-label="Navegación interna de la aplicación Zora Guardian"
          >
            {[
              { id: "inicio" as const, label: "Inicio", icon: Home },
              { id: "consumo" as const, label: "Consumo", icon: Clock },
              { id: "alertas" as const, label: "Alertas", icon: Bell },
              { id: "ajustes" as const, label: "Ajustes", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-0.5 text-[10.5px] font-medium transition-all duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#38bdf8] ${
                    active ? "text-[#17a2ff]" : "text-[#c4d7e9] hover:text-white"
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-4 h-4 mb-0.5" aria-hidden="true" />
                    {tab.id === "alertas" && unreadAlertCount > 0 && (
                      <span
                        aria-label={`${unreadAlertCount} nuevas alertas`}
                        className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#ef4444] text-[8.5px] font-bold text-white flex items-center justify-center tabular-nums"
                      >
                        {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
                      </span>
                    )}
                  </div>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
