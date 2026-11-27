import { Cpu, Radar, Smartphone } from "lucide-react";

const PROBLEM_POINTS = [
  {
    index: "01",
    text: "No saber cuánta agua queda en la cisterna hasta abrir la tapa manualmente.",
  },
  {
    index: "02",
    text: "Descubrir una fuga, bomba detenida o un nivel crítico demasiado tarde.",
  },
  {
    index: "03",
    text: "Coordinar cisternas o pipas de abastecimiento sin información actualizada.",
  },
];

const HOW_STEPS = [
  {
    step: "01",
    title: "Mide",
    description:
      "El sensor ultrasónico calcula la distancia hasta la superficie del agua desde la parte superior, sin contacto directo con el líquido.",
    icon: Radar,
  },
  {
    step: "02",
    title: "Comunica",
    description:
      "La unidad electrónica procesa la lectura, filtra turbulencias de llenado y la transmite mediante su conexión IoT.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Te informa",
    description:
      "Consulta el porcentaje y los litros disponibles en tu pantalla y recibe avisos cuando el nivel cruza tus umbrales.",
    icon: Smartphone,
  },
];

export function ProblemAndSteps() {
  return (
    <>
      <section className="bg-[#e6f0f8] text-[#071d39] border-b border-[#c8daea]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-[#0070cc]">
            <span>01 · El problema cotidiano</span>
            <span className="font-mono tabular-nums text-[#4e7396]">01 — 04</span>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-[clamp(2.1rem,3.6vw,3.3rem)] font-semibold leading-[1.08] tracking-tight text-[#071d39] text-balance">
                El agua se acaba.{" "}
                <span className="text-[#2f6090]">La señal llega tarde.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#3d5a76]">
                Cuando el suministro es irregular, depender de revisiones manuales puede dejarte sin
                margen para reaccionar ni planificar el consumo diario.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-3.5">
              {PROBLEM_POINTS.map((item) => (
                <div
                  key={item.index}
                  className="bg-white border border-[#c7daea] rounded-xl px-6 py-5 flex items-center gap-5 shadow-[0_8px_24px_rgba(7,29,57,0.05)]"
                >
                  <span className="w-9 h-9 rounded-lg bg-[#e6f2fc] border border-[#bedcf5] font-mono text-xs font-bold tabular-nums text-[#0070cc] flex items-center justify-center shrink-0">
                    {item.index}
                  </span>
                  <p className="text-sm sm:text-[15px] leading-relaxed font-medium text-[#153554]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="scroll-mt-[76px] bg-[#0d335e] bg-tech-grid text-white border-b border-[#1c4b7d]"
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-[#5ce1f5]">
                <span>02 · Una lectura más clara</span>
                <span className="font-mono tabular-nums text-[#8ab4cf]">02 — 04</span>
              </div>
              <h2 className="mt-4 text-[clamp(2rem,3.4vw,3.1rem)] font-semibold leading-[1.08] tracking-tight text-white text-balance">
                Del tanque a tu pantalla.
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#c6dcf0] max-w-[400px]">
              Un sistema pensado para que puedas consultar el estado de tu reserva y tomar
              decisiones con tiempo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="bg-[#f4f8fc] text-[#071d39] border border-white/80 rounded-2xl p-8 sm:p-9 flex flex-col items-center text-center shadow-[0_18px_40px_rgba(3,16,36,0.28)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between w-full mb-5">
                    <span className="font-mono text-xs font-bold tabular-nums text-[#0070cc]">
                      {item.step}
                    </span>
                    <span className="w-8 h-px bg-[#c4d8ea]" aria-hidden="true" />
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-[#e3f0fc] border border-[#b8d8f5] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#0070cc]" aria-hidden="true" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-[#071d39]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#43607c]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
