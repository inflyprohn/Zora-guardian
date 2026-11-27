export const MAX_CAPACITY_LITERS = 10000;
export const DEFAULT_LEVEL = 80;
export const DEFAULT_PREVENTIVE_THRESHOLD = 30;
export const DEFAULT_CRITICAL_THRESHOLD = 15;

export type HistoryEventType = "Llenado" | "Consumo" | "Ajuste manual" | "Reinicio";

export interface HistoryEntry {
  id: string;
  timestamp: string;
  previousLevel: number;
  newLevel: number;
  eventType: HistoryEventType;
  litersAfter: number;
}

export type AlertTone = "full" | "normal" | "moderate" | "preventive" | "critical";

export interface AlertNotificationEntry {
  id: string;
  timestamp: string;
  tone: AlertTone;
  title: string;
  message: string;
  level: number;
}

export interface CisternAlertState {
  tone: AlertTone;
  statusLabel: string;
  shortLabel: string;
  notificationTitle: string;
  notificationMessage: string;
  accentColor: string;
  badgeBgClass: string;
  badgeTextClass: string;
  badgeBorderClass: string;
  bannerBgClass: string;
  bannerBorderClass: string;
  bannerTextClass: string;
  phonePillClass: string;
  phoneCardClass: string;
}

export function calculateLiters(levelPercent: number): number {
  const clamped = Math.max(0, Math.min(100, Math.round(levelPercent)));
  return Math.round((MAX_CAPACITY_LITERS * clamped) / 100);
}

export function getCisternAlertState(
  levelPercent: number,
  preventiveThreshold = DEFAULT_PREVENTIVE_THRESHOLD,
  criticalThreshold = DEFAULT_CRITICAL_THRESHOLD
): CisternAlertState {
  const level = Math.max(0, Math.min(100, Math.round(levelPercent)));
  const liters = calculateLiters(level).toLocaleString("es-HN");

  if (level === 100) {
    return {
      tone: "full",
      statusLabel: "CISTERNA LLENA",
      shortLabel: "Cisterna llena",
      notificationTitle: "Cisterna llena al 100%",
      notificationMessage: `Capacidad máxima alcanzada (${liters} L). Verifica el cierre de la válvula de entrada.`,
      accentColor: "#22c55e",
      badgeBgClass: "bg-[#dff4eb]",
      badgeTextClass: "text-[#115e4a]",
      badgeBorderClass: "border-[#9ad9c2]",
      bannerBgClass: "bg-[#0d3b32]/90",
      bannerBorderClass: "border-[#27b887]",
      bannerTextClass: "text-[#c8f7e4]",
      phonePillClass: "bg-[#16a34a] text-white",
      phoneCardClass: "bg-[#063433]/90 border-[#149a6d]/80 text-[#d1fae5]",
    };
  }

  if (level > Math.max(40, preventiveThreshold)) {
    return {
      tone: "normal",
      statusLabel: "NIVEL NORMAL",
      shortLabel: "Nivel normal",
      notificationTitle: "Operación estable",
      notificationMessage: `Reserva disponible de ${liters} L (${level}%). Sin alertas activas.`,
      accentColor: "#159dc4",
      badgeBgClass: "bg-[#dff4eb]",
      badgeTextClass: "text-[#16785f]",
      badgeBorderClass: "border-[#b5e4d4]",
      bannerBgClass: "bg-[#0f3454]/85",
      bannerBorderClass: "border-[#2b6f99]",
      bannerTextClass: "text-[#d4eef9]",
      phonePillClass: "bg-[#19a82b] text-white",
      phoneCardClass: "bg-[#063433]/90 border-[#149a6d]/80 text-[#d1fae5]",
    };
  }

  if (level > preventiveThreshold) {
    return {
      tone: "moderate",
      statusLabel: "NIVEL MODERADO",
      shortLabel: "Nivel moderado",
      notificationTitle: "Reserva en nivel moderado",
      notificationMessage: `Quedan ${liters} L (${level}%). Monitorea el consumo del día.`,
      accentColor: "#38bdf8",
      badgeBgClass: "bg-[#e3f2fa]",
      badgeTextClass: "text-[#0e5a84]",
      badgeBorderClass: "border-[#add8ee]",
      bannerBgClass: "bg-[#123759]/90",
      bannerBorderClass: "border-[#3ea8db]",
      bannerTextClass: "text-[#d9f1fc]",
      phonePillClass: "bg-[#0284c7] text-white",
      phoneCardClass: "bg-[#092b4d]/90 border-[#2884c7]/80 text-[#dbeafe]",
    };
  }

  if (level > criticalThreshold) {
    return {
      tone: "preventive",
      statusLabel: "ALERTA PREVENTIVA",
      shortLabel: "Alerta preventiva",
      notificationTitle: "Alerta preventiva de nivel",
      notificationMessage: `La reserva bajó a ${level}% (${liters} L). Conviene programar próximo abastecimiento.`,
      accentColor: "#f59e0b",
      badgeBgClass: "bg-[#fff3dc]",
      badgeTextClass: "text-[#8a5508]",
      badgeBorderClass: "border-[#efd095]",
      bannerBgClass: "bg-[#4a320b]/90",
      bannerBorderClass: "border-[#e09b2d]",
      bannerTextClass: "text-[#fde9c4]",
      phonePillClass: "bg-[#d97706] text-white",
      phoneCardClass: "bg-[#3b290a]/90 border-[#d97706]/85 text-[#fef3c7]",
    };
  }

  return {
    tone: "critical",
    statusLabel: "ALERTA CRÍTICA",
    shortLabel: "Nivel crítico",
    notificationTitle: "Alerta crítica de reserva",
    notificationMessage: "Nivel crítico de agua. Se recomienda abastecimiento",
    accentColor: "#ef4444",
    badgeBgClass: "bg-[#fbe8e6]",
    badgeTextClass: "text-[#9c2b23]",
    badgeBorderClass: "border-[#efb9b4]",
    bannerBgClass: "bg-[#54171a]/95",
    bannerBorderClass: "border-[#ef5b54]",
    bannerTextClass: "text-[#ffd8d6]",
    phonePillClass: "bg-[#dc2626] text-white",
    phoneCardClass: "bg-[#451419]/95 border-[#ef4444]/85 text-[#fee2e2]",
  };
}
