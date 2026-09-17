import Image from "next/image";

const navLinks = [
  { label: "Conciertos", href: "#" },
  { label: "Festivales", href: "#" },
  { label: "Teatro & Comedia", href: "#" },
  { label: "Mis Entradas", href: "#" },
];

export default function Navbar() {
  return (
    <header className="border-b border-brand-border bg-white">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
        <Image
          src="/logo.svg"
          alt="TicketDsaster Logo"
          width={36}
          height={36}
          className="h-9 w-9"
        />
        <h2 className="font-display text-lg font-bold tracking-tight text-brand-ink">
          TicketDsaster
        </h2>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#"
            className="rounded-full bg-brand-maroon px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-maroon-dark"
          >
            Explorar Eventos
          </a>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brand-ink/80 transition-colors hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
