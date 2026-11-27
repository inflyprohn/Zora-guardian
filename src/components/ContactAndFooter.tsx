const BRAND_LOGO_URL = "/assets/aistudio/logozora_290e0fb5.png";

export function ContactAndFooter() {
  return (
    <footer className="bg-[#030d1b] text-[#9bb0bd] border-t border-[#15304f]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-8 flex flex-wrap items-center justify-between gap-4 text-xs">
        <a
          href="#inicio"
          aria-label="Zora Guardian inicio"
          className="inline-flex items-center bg-[#f3f7fa] border border-[#1d4066] px-3 py-1.5"
        >
          <img
            src={BRAND_LOGO_URL}
            alt="Zora Guardian"
            referrerPolicy="no-referrer"
            className="h-8 w-auto object-contain select-none"
          />
        </a>

        <span className="text-[#8eb2cb]">Monitoreo inteligente de agua · Honduras</span>

        <div className="flex items-center gap-6">
          <span>© {new Date().getFullYear()} Zora Guardian</span>
          <a href="#inicio" className="text-[#5ce1f5] hover:text-white transition-colors">
            Volver arriba ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
