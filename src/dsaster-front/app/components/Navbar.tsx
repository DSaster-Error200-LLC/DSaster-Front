import { Wordmark } from "@dsaster/ui";
import ButtonLink from "@/app/components/ButtonLink";

const navLinks = [
  { label: "Conciertos", href: "#" },
  { label: "Festivales", href: "#" },
  { label: "Teatro & Comedia", href: "#" },
  { label: "Mis Entradas", href: "#" },
];

export default function Navbar() {
  return (
    <header className="border-b border-line bg-surface-100">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Wordmark size="md" />
        <div className="hidden items-center gap-8 md:flex">
          <ButtonLink href="#" variant="secondary" size="sm">
            Explorar Eventos
          </ButtonLink>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-(--radius-sm) text-body font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
