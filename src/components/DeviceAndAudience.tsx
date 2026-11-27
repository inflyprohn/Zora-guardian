import { useState } from "react";
import { Building2, Cpu, Home } from "lucide-react";

const EXPLODED_IMAGE_URL = "/src/assets/images/zora_exploded_view_1795799022341.jpg";

const DEVICE_SPECS = [
  {
    index: "01",
    title: "Caja electrónica IP65 con antena IoT",
    description:
      "Gabinete sellado con prensaestopas impermeables y antena externa para transmitir lecturas confiables desde exteriores.",
  },
  {
    index: "02",
    title: "Sensor ultrasónico dual IP67",
    description:
      "Transductor sellado de doble cápsula instalado en la parte superior del tanque para medir sin contacto con el agua.",
  },
  {
    index: "03",
    title: "Consulta digital en tiempo real",
    description:
      "Visualiza porcentaje, litros disponibles, consumo de las últimas 24 horas y alertas de estado desde tu teléfono.",
  },
];

export function DeviceAndAudience() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <>
      <section
        id="producto"
        className="scroll-mt-[76px] bg-[#103b6b] text-white border-b border-[#22548a]"
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-[#5ce1f5]">
                <span>04 · Diseñado para estar ahí</span>
                <span className="font-mono tabular-nums text-[#9cc2df]">04 — 04</span>
              </div>
              <h2 className="mt-4 text-[clamp(2rem,3.4vw,3.1rem)] font-semibold leading-[1.08] tracking-tight text-white text-balance">
                Pequeño equipo. <span className="text-[#9fd2f5]">Una vista más amplia.</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#cee2f2] max-w-[390px]">
              Una unidad electrónica protegida y un sensor ultrasónico trabajan en conjunto para
              llevar la medición hasta tu dispositivo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 bg-[#092444] border border-[#2d6196] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(4,16,36,0.42)]">
              <div className="aspect-[4/3] w-full overflow-hidden flex items-center justify-center bg-[#081c36]">
                {!imgFailed ? (
                  <img
                    src={EXPLODED_IMAGE_URL}
                    alt="Vista conceptual despiezada del sensor Zora Guardian mostrando carcasa, circuito IoT y transductor ultrasónico"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                    <Cpu className="w-12 h-12 text-[#5ce1f5] mb-3" aria-hidden="true" />
                    <p className="font-display font-semibold text-lg text-white">
                      Arquitectura modular Zora Guardian
                    </p>
                    <p className="text-xs text-[#9cb8cc] mt-1">
                      Carcasa sellada · Placa IoT · Transductor ultrasónico
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center gap-4">
              {DEVICE_SPECS.map((spec) => (
                <div
                  key={spec.index}
                  className="bg-[#f4f8fc] text-[#071d39] border border-white/80 rounded-xl p-5 sm:p-6 flex items-center gap-5 shadow-[0_14px_30px_rgba(3,16,36,0.22)]"
                >
                  <span className="w-10 h-10 rounded-lg bg-[#e3f0fc] border border-[#b8d8f5] font-mono text-xs font-bold tabular-nums text-[#0070cc] flex items-center justify-center shrink-0">
                    {spec.index}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#071d39]">
                      {spec.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#43607c]">
                      {spec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="beneficios"
        className="scroll-mt-[76px] bg-[#dce9f4] text-[#071d39] border-b border-[#bfd4e6]"
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wider text-[#0070cc]">
              Una solución para distintos espacios
            </p>
            <h2 className="mt-4 text-[clamp(2rem,3.4vw,2.9rem)] font-semibold leading-[1.08] tracking-tight text-[#071d39] text-balance">
              Donde el agua no puede faltar.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#3d5a76] max-w-[380px]">
              Adaptado tanto para reservas domésticas como para entornos comerciales y de servicio
              continuo.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <article className="bg-white border border-[#c4d8ea] rounded-2xl p-8 flex flex-col items-center text-center justify-center min-h-[250px] shadow-[0_12px_30px_rgba(7,29,57,0.06)]">
              <div className="w-12 h-12 rounded-xl bg-[#e6f2fc] border border-[#bedcf5] flex items-center justify-center">
                <Home className="w-6 h-6 text-[#0070cc]" aria-hidden="true" />
              </div>
              <span className="mt-4 font-mono text-[11px] font-semibold tabular-nums text-[#0070cc]">
                01 · Hogares
              </span>
              <h3 className="mt-2 text-xl font-semibold text-[#071d39]">En casa</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#43607c]">
                Para viviendas con cisternas subterráneas o tanques elevados que necesitan saber
                exactamente cuánta reserva queda.
              </p>
            </article>

            <article className="bg-[#0a294d] text-white border border-[#1d4a7a] rounded-2xl p-8 flex flex-col items-center text-center justify-center min-h-[250px] shadow-[0_16px_36px_rgba(7,29,57,0.22)]">
              <div className="w-12 h-12 rounded-xl bg-[#103866] border border-[#285d96] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#5ce1f5]" aria-hidden="true" />
              </div>
              <span className="mt-4 font-mono text-[11px] font-semibold tabular-nums text-[#5ce1f5]">
                02 · Negocios
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white">En tu operación</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#c6dcf0]">
                Para restaurantes, clínicas, centros educativos, comercios y administradores de
                edificios que operan sin margen de corte.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
