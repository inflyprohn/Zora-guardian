import { useState } from "react";
import { Menu, X, ArrowDownRight } from "lucide-react";

const LOGO_URL = `${import.meta.env.BASE_URL}assets/zora-guardian-logo.svg`;

const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#simulador", label: "Simulador" },
  { href: "#interior", label: "Interior" },
  { href: "#producto", label: "El dispositivo" },
  { href: "#beneficios", label: "Beneficios" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#f2f6fa]/95 backdrop-blur-md border-b border-[#b9cddc]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 h-[76px] flex items-center justify-between gap-8">
        <a
          href="#inicio"
          className="inline-flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0084ff]"
          aria-label="Zora Guardian, inicio"
        >
          <img
            src={LOGO_URL}
            alt="Zora Guardian"
            referrerPolicy="no-referrer"
            className="h-10 sm:h-11 w-auto object-contain select-none"
          />
        </a>

        <nav
          className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[#173654]"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#0084ff] hover:text-[#0070d6] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0084ff]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#simulador"
            className="hidden md:inline-flex items-center gap-2.5 bg-[#071d39] hover:bg-[#0d2d54] text-white px-4 py-2.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0084ff]"
          >
            <span>Probar simulador</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-[#5ce1f5]" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#071d39] hover:bg-[#e1ebf2] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0084ff]"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#f2f6fa] border-t border-[#c9dae6] px-5 py-5">
          <nav className="flex flex-col gap-3" aria-label="Navegación móvil">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-semibold text-[#0a2442] border-b border-[#d4e1eb] hover:text-[#0070d6]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#simulador"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-between bg-[#071d39] text-white px-4 py-3 text-sm font-semibold"
            >
              <span>Probar simulador</span>
              <ArrowDownRight className="w-4 h-4 text-[#5ce1f5]" aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
