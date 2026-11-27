import { useState } from "react";
import { ArrowDownRight, ArrowRight, Waves } from "lucide-react";

const HERO_IMAGE_URL =
  `${import.meta.env.BASE_URL}assets/aistudio/Sistema_Zora_Guardian_en_accio_n_cecfec89.png`;

export function HeroSection() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-[#041122] via-[#071c36] to-[#0a284b] bg-tech-grid border-b border-[#18385c]"
    >
      {/* Subtle technological radial illumination behind product */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[8%] w-[520px] h-[520px] rounded-full bg-[#0084ff]/15 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[4%] w-[420px] h-[420px] rounded-full bg-[#38bdf8]/10 blur-[100px]"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-[#5ce1f5]">
            <span className="w-7 h-0.5 bg-[#0084ff]" aria-hidden="true" />
            <span>Monitoreo inteligente de agua</span>
          </div>

          <h1 className="mt-5 text-[clamp(2.4rem,4.3vw,4.1rem)] font-semibold leading-[1.04] tracking-tight text-white text-balance">
            Que nunca te tome por <span className="text-[#46d3ff]">sorpresa</span>
            <span className="text-[#c9e66b]">.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#b4cadb] max-w-[460px]">
            Conoce el nivel de tu cisterna sin tener que abrirla. Zora Guardian lleva la lectura del
            agua a tu celular con telemetría ultrasónica de alta precisión.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href="#simulador"
              className="inline-flex items-center gap-5 bg-[#c9e66b] hover:bg-[#d7f07f] text-[#041122] px-6 py-3.5 text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ce1f5]"
            >
              <span>Probar simulador</span>
              <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
            </a>

            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#cbe3f3] hover:text-[#5ce1f5] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5ce1f5]"
            >
              <span>Conocer cómo funciona</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 relative flex flex-col items-center">
          <div
            className="relative w-full bg-[#09213d] border border-[#224b75] rounded-xl shadow-[0_24px_60px_rgba(2,10,24,0.65)] overflow-hidden"
            aria-label="Sistema Zora Guardian instalado sobre tanque de agua con lectura en aplicación móvil"
          >
            <div className="aspect-[1672/941] w-full bg-[#0c2645] overflow-hidden">
              {!imgFailed ? (
                <img
                  src={HERO_IMAGE_URL}
                  alt="Sistema Zora Guardian en acción: caja electrónica IP65, sensor ultrasónico IP67 sobre tanque y lectura en aplicación móvil"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0c2645] to-[#081b33] flex flex-col items-center justify-center p-8 text-center">
                  <Waves className="w-12 h-12 text-[#38bdf8] mb-3" aria-hidden="true" />
                  <p className="font-display font-semibold text-lg text-white">
                    Sensor Zora Guardian
                  </p>
                  <p className="text-xs text-[#9cb8cc] mt-1">
                    Caja electrónica IP65 y sensor ultrasónico IP67
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
