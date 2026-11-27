const $ = (selector) => document.querySelector(selector);
const range = $("#levelRange");
const tankWater = $("#tankWater");
const tankPercent = $("#tankPercent");
const rangeValue = $("#rangeValue");
const litersReadout = $("#litersReadout");
const appPercent = $("#appPercent");
const appLiters = $("#appLiters");
const gaugeValue = $("#gaugeValue");
const statusPill = $("#statusPill");
const alertBox = $("#alertBox");
const alertTitle = $("#alertTitle");
const alertText = $("#alertText");
const alertSymbol = $("#alertSymbol");
const circumference = 2 * Math.PI * 76;

function updateLevel(value) {
  const level = Math.max(0, Math.min(100, Number(value)));
  const liters = Math.round(level * 100);
  const formattedLiters = liters.toLocaleString("es-HN");
  range.value = level;
  tankWater.style.height = `${level}%`;
  tankPercent.textContent = `${level}%`;
  rangeValue.textContent = `${level}%`;
  litersReadout.textContent = `${formattedLiters} L / 10,000 L`;
  appPercent.textContent = `${level}%`;
  appLiters.textContent = `${formattedLiters} L`;
  gaugeValue.style.strokeDasharray = circumference;
  gaugeValue.style.strokeDashoffset = circumference * (1 - level / 100);

  let state = "Normal";
  let title = "Todo en orden";
  let message = "El nivel se encuentra dentro del rango habitual.";
  let symbol = "✓";
  let type = "normal";
  let color = "#159dc4";

  if (level <= 20) {
    state = "Crítico"; title = "Nivel crítico de agua";
    message = `La cisterna tiene ${level}% de agua. Conviene programar el abastecimiento.`;
    symbol = "!"; type = "critical"; color = "#d45d55";
  } else if (level <= 35) {
    state = "Nivel bajo"; title = "Nivel de agua bajo";
    message = `El nivel está en ${level}%. Considera abastecer la cisterna.`;
    symbol = "!"; type = "warning"; color = "#d89a35";
  } else if (level >= 95) {
    state = "Casi llena"; title = "Cisterna casi llena";
    message = `El nivel alcanzó ${level}%. Verifica el abastecimiento para evitar desbordamientos.`;
    symbol = "!"; type = "warning"; color = "#d89a35";
  }
  statusPill.textContent = state;
  statusPill.style.color = type === "normal" ? "#20866d" : type === "critical" ? "#a13e35" : "#94610b";
  statusPill.style.background = type === "normal" ? "#dff4eb" : type === "critical" ? "#f6ceca" : "#ffe1a8";
  alertBox.className = `alert-box ${type}`;
  alertTitle.textContent = title;
  alertText.textContent = message;
  alertSymbol.textContent = symbol;
  gaugeValue.style.stroke = color;
}

range.addEventListener("input", event => updateLevel(event.target.value));
$("#drainBtn").addEventListener("click", () => updateLevel(Number(range.value) - 10));
$("#fillBtn").addEventListener("click", () => updateLevel(Number(range.value) + 10));
$("#resetBtn").addEventListener("click", () => updateLevel(78));
updateLevel(78);

const menuToggle = $(".menu-toggle");
const nav = $(".main-nav");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("menu-open", open);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

$("#year").textContent = new Date().getFullYear();
$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#name").value.trim();
  const feedback = $("#formFeedback");
  feedback.textContent = `Gracias, ${name}. La interfaz está lista; conecta este formulario a tu correo o CRM para recibir consultas reales.`;
  event.target.reset();
});
