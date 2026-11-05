import Link from "next/link";
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
      <nav
        aria-label="Principal"
        className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-(--space-4) px-(--space-4) sm:px-(--space-5)"
      >
        <Link
          href="/"
          className="rounded-(--radius-sm) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <Wordmark size="md" />
        </Link>
        <div className="hidden items-center gap-(--space-5) md:flex">
          <ButtonLink href="/" variant="secondary" size="sm">
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
