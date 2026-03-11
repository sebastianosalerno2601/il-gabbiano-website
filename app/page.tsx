"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/* Count-up quando entra in vista */
function AnimatedNumber({
  end,
  suffix = "",
  duration = 2000,
  startOnView = true,
}: {
  end: number;
  suffix?: string;
  duration?: number;
  startOnView?: boolean;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!startOnView || started) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startOnView, started]);

  useEffect(() => {
    if (!started) return;
    const start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - progress) ** 2;
      setCount(Math.floor(start + (end - start) * easeOut));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* Gabbiano stilizzato SVG */
function GabbianoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 22 Q 25 8, 40 22 Q 55 8, 70 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="40" cy="24" rx="8" ry="5" fill="currentColor" opacity="0.9" />
      <path
        d="M38 20 L40 16 L42 20"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const spring = { type: "spring" as const, stiffness: 100, damping: 15 };
const fadeIn = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { ...spring, delay: 0.1 },
};

const slideUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: spring,
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: spring,
};

export default function Home() {
  const [isNightMode, setIsNightMode] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const navItems = [
    { label: "Servizi", href: "#servizi" },
    { label: "Perché noi", href: "#perche-noi" },
    { label: "Team", href: "#team" },
    { label: "Clienti", href: "#clienti" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollToSection = (hash: string) => {
    setMobileMenuOpen(false);
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 80;
    const delay = 150;
    setTimeout(() => {
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, delay);
  };
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-colors duration-700 ${isNightMode ? "turno-notte" : ""}`}
    >
      {/* Toggle Turno di notte */}
      <motion.button
        type="button"
        onClick={() => setIsNightMode((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border-2 border-sky-500/80 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-colors hover:border-sky-400 hover:bg-slate-800"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={spring}
        aria-pressed={isNightMode}
      >
        <span className="text-lg" aria-hidden>
          {isNightMode ? "☀️" : "🌙"}
        </span>
        {isNightMode ? "Torna al giorno" : "Vivi il turno di notte"}
      </motion.button>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <motion.a
            href="#"
            className="text-2xl font-bold tracking-tight text-slate-900"
            whileHover={{ scale: 1.02 }}
            transition={spring}
          >
            Il Gabbiano <span className="text-sky-600">SRL</span>
          </motion.a>

          {/* Desktop nav */}
          <nav className="hidden gap-8 lg:flex">
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="relative text-sm font-medium text-slate-600 after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-sky-500 after:transition-all after:duration-300 hover:text-sky-600 hover:after:w-full"
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#contatti"
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(14, 165, 233, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
            >
              Contatti
            </motion.a>
          </nav>

          {/* Mobile burger button */}
          <motion.button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-slate-300 bg-slate-100 text-slate-800 shadow-sm lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
            whileTap={{ scale: 0.96 }}
          >
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-all ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-5 rounded-full bg-current transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-all ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </motion.button>
        </div>

        {/* Mobile menu panel */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className="rounded-lg px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-600"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contatti"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#contatti");
              }}
              className="mt-2 rounded-full bg-sky-600 px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-sky-500"
            >
              Contatti
            </a>
          </nav>
        </motion.div>
      </motion.header>

      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden pt-16 gradient-mesh">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <motion.div className="absolute inset-0 bg-slate-900/30" style={{ opacity: heroOpacity }} />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_70%)]" />
        <div className="absolute inset-0 grain" aria-hidden />
        {/* Stelle (visibili in turno di notte) */}
        <div className="night-stars absolute inset-0" aria-hidden>
          {[...Array(24)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                left: `${(i * 7 + 13) % 100}%`,
                top: `${(i * 11 + 5) % 70}%`,
                opacity: 0.4 + (i % 3) * 0.2,
              }}
            />
          ))}
        </div>
        {/* Gabbiano in hero */}
        <motion.div
          className="absolute right-8 top-24 hidden text-sky-400/60 md:block lg:right-16"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, ...spring }}
        >
          <motion.div
            className="h-14 w-28"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <GabbianoIcon className="h-full w-full" />
          </motion.div>
        </motion.div>
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-32 sm:px-6 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/90 px-4 py-1.5 text-sm font-semibold text-sky-700"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-600" />
              </span>
              Dal 2007 · Circa 30 dipendenti · Napoli
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.35 }}
              className="mb-4 text-sm font-semibold uppercase tracking-widest text-sky-600"
            >
              Sicurezza e professionalità
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.45 }}
              className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
            >
              Vigilanza non armata e portierato{" "}
              <span className="relative inline-block bg-linear-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">
                su misura
                <motion.span
                  className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-sky-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.6 }}
              className="mt-6 max-w-xl text-lg text-slate-600"
            >
              Vigilanza non armata e portierato a Napoli e in Campania: sorveglianza discreta,
              videosorveglianza e front office. Tecnologia, formazione e rispetto delle normative
              per la sicurezza di aziende e condomini.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.75 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.a
                href="#contatti"
                className="group inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-600/25"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(14, 165, 233, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
              >
                Richiedi preventivo
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                >
                  →
                </motion.span>
              </motion.a>
              <motion.a
                href="#servizi"
                className="inline-flex items-center rounded-full border-2 border-slate-300 px-6 py-3.5 text-base font-semibold text-slate-700"
                whileHover={{ scale: 1.03, borderColor: "rgb(56 189 248)", color: "rgb(3 105 161)" }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
              >
                I nostri servizi
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        {/* Decorative grid */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(to_top,rgba(15,23,42,0.03)_0%,transparent)]"
          aria-hidden
        />
      </section>

      {/* Il Gabbiano in numeri */}
      <section className="relative border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              In cifre
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Il Gabbiano in numeri
            </h2>
          </motion.div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: 2007, suffix: "", label: "Anno di fondazione" },
              { value: 30, suffix: "+", label: "Professionisti" },
              { value: 15, suffix: "+", label: "Anni di esperienza" },
              { value: 100, suffix: "%", label: "In linea con la normativa" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
                className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50/50 py-8 px-4"
              >
                <span className="text-4xl font-extrabold tabular-nums text-sky-600 sm:text-5xl">
                  <AnimatedNumber end={item.value} suffix={item.suffix} duration={1800} />
                </span>
                <span className="mt-2 text-sm font-medium text-slate-600">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section id="servizi" className="relative scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div className="text-center" {...fadeIn}>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              Cosa offriamo
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Vigilanza non armata e portierato a Napoli
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Servizi di sicurezza e accoglienza a Napoli e in Campania: personale formato,
              mezzi tecnologici e rispetto della normativa (D.M. 269/2010).
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Vigilanza non armata",
                description:
                  "Sorveglianza discreta e su misura: controllo chiusure locali e quadri elettrici, registrazione accessi, ispezione ingressi, verifica impianti antintrusione e aree esterne (parcheggi, giardini). Prevenzione incendi, allagamenti e fughe di gas.",
                image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
              },
              {
                title: "Portierato e front office",
                description:
                  "Interfaccia impeccabile con chi transita nei locali: sistemi antitaccheggio, front office e front line che fungono da biglietto da visita. Presenza in realtà condominiali e aziendali a Napoli e provincia.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
              },
              {
                title: "Videosorveglianza e servizi d'ordine",
                description:
                  "Completamento del servizio di sicurezza con tecnologia all'avanguardia e personale addestrato sulle norme di pubblica sicurezza (D.M. n. 269/2010) per una tutela conforme e una costante tranquillità.",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...spring, delay: i * 0.12 }}
                whileHover={{ y: -8, transition: spring }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50"
              >
                <motion.div
                  className="relative h-48 w-full overflow-hidden"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
                <div className="p-8">
                  <motion.h3
                    className="text-xl font-bold text-slate-900"
                    whileHover={{ x: 4 }}
                    transition={spring}
                  >
                    {item.title}
                  </motion.h3>
                  <p className="mt-3 text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dettaglio vigilanza */}
          <motion.div
            className="mt-24 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-50/80 p-8 sm:p-10 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <div className="mb-6 flex items-center gap-3">
              <motion.span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.2 }}
              >
                ✓
              </motion.span>
              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Nel servizio di vigilanza non armata rientrano inoltre
              </h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Controllo chiusure di porte, finestre e quadri elettrici",
                "Registrazione accessi e controllo persone in transito",
                "Ispezione ingressi e verifica impianto d'allarme",
                "Verifica aree esterne: parcheggi, giardini",
                "Allontanamento persone non autorizzate o sospette",
                "Prevenzione incendi, allagamenti, fughe di gas",
                "Mansioni concordate con il cliente",
              ].map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-lg py-1.5 text-slate-700 transition-colors hover:bg-sky-50/50"
                >
                  <motion.span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500"
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                  />
                  {point}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Perché noi */}
      <section id="perche-noi" className="relative scroll-mt-20 border-t border-slate-200 bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="relative mb-16 overflow-hidden rounded-2xl sm:mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <motion.div
              className="relative h-64 sm:h-80 md:h-96"
              whileInView={{ scale: [0.98, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80"
                alt="Team professionale"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <blockquote className="text-lg font-medium italic sm:text-xl">
                  &ldquo;Il rapporto umano tra vertice dell&apos;azienda e i propri dipendenti
                  è sempre stato un baluardo distintivo de Il Gabbiano.&rdquo;
                </blockquote>
                <cite className="mt-3 block text-sm not-italic text-sky-200">
                  — Antonietta Festinese, Amministratore Unico
                </cite>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              I nostri punti di forza
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Perché scegliere Il Gabbiano
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Normativa", icon: "⚖️", text: "Rispetto del D.M. n. 269/2010 e disposizioni di pubblica sicurezza" },
              { label: "Formazione", icon: "📚", text: "Addetti formati e aggiornati su tecnologia e procedure" },
              { label: "Affidabilità", icon: "🎯", text: "Accuratezza, puntualità e sinergia da oltre 15 anni" },
              { label: "Rapporto umano", icon: "🤝", text: "Cura del rapporto tra azienda e dipendenti per un servizio duraturo" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 12px 40px -12px rgba(14, 165, 233, 0.25)" }}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition-colors hover:border-sky-200 hover:bg-white"
              >
                <motion.span
                  className="mb-3 block text-2xl"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={spring}
                >
                  {item.icon}
                </motion.span>
                <h4 className="font-bold text-slate-900">{item.label}</h4>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="mx-auto mt-12 max-w-2xl text-center text-slate-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            La sicurezza è uno degli obiettivi aziendali più impegnativi: investiamo in
            aggiornamento, tecnologia e formazione per garantire ai clienti un grado di
            tranquillità elevato e una collaborazione che in molti casi prosegue da oltre un decennio.
          </motion.p>
        </div>
      </section>

      {/* Il nostro team */}
      <section id="team" className="relative scroll-mt-20 border-t border-slate-200 bg-slate-50/50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              Le persone
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Il nostro team
            </h2>
          </motion.div>

          <div
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            onClick={() => setSelectedTeamIndex(null)}
            role="presentation"
          >
            {[
              {
                image: "/Antonietta-Festinese.jpeg",
                name: "Antonietta Festinese",
                role: "Amministratore unico.",
              },
              {
                image: "/Loredana-Palladino.jpeg",
                name: "Loredana Palladino",
                role: "Responsabile commerciale.",
              },
              {
                image: "/Maria-Pia-Palladino.jpeg",
                name: "Maria Pia Palladino",
                role: "Responsabile alle vendite e responsabile commerciale.",
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTeamIndex((prev) => (prev === i ? null : i));
                }}
                className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-slate-200 shadow-lg touch-manipulation"
                aria-expanded={selectedTeamIndex === i}
                aria-label={`${member.name}, ${member.role}. Tocca per ${selectedTeamIndex === i ? "chiudere" : "vedere dettagli"}`}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300 group-hover:bg-slate-900/75 ${
                    selectedTeamIndex === i ? "bg-slate-900/85" : "bg-slate-900/0"
                  }`}
                  aria-hidden={selectedTeamIndex !== i}
                >
                  <span
                    className={`mt-auto text-lg font-bold text-white transition-opacity duration-300 sm:text-xl ${
                      selectedTeamIndex === i ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {member.name}
                  </span>
                  <span
                    className={`mt-1 text-sm font-medium text-sky-200 transition-opacity duration-300 sm:text-base ${
                      selectedTeamIndex === i ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parlano di noi / Riconoscimenti */}
      <section id="stampa" className="relative border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              Riconoscimenti
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Parlano di noi
            </h2>
          </motion.div>
          <motion.a
            href="https://napoli.repubblica.it/dossier-adv/eccellenze-della-campania/2019/06/18/news/un_partner_molto_affidabile_e_competente_per_la_sicurezza_dei_privati_e_delle_aziende-229095405/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 transition-colors hover:border-sky-200 hover:bg-sky-50/30 sm:flex-row sm:items-start sm:gap-6 sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            whileHover={{ y: -2 }}
          >
            <span className="text-4xl font-bold text-slate-300 sm:text-5xl">“</span>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg font-medium text-slate-800 sm:text-xl">
                Un partner molto affidabile e competente per la sicurezza dei privati e delle aziende
              </p>
              <p className="mt-2 text-slate-600">
                La Repubblica — Eccellenze della Campania, 18 giugno 2019
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-600">
                Leggi l&apos;articolo
                <span aria-hidden>→</span>
              </span>
            </div>
          </motion.a>
        </div>
      </section>

      {/* Clienti */}
      <section id="clienti" className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920&q=60"
            alt=""
            fill
            className="object-cover opacity-[0.03]"
            sizes="100vw"
          />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div className="text-center" {...fadeIn}>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              Chi si fida di noi
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Clienti e realtà servite
            </h2>
          </motion.div>

          <motion.div
            className="relative mt-12 flex flex-wrap justify-center gap-x-10 gap-y-6 text-slate-600"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
          >
            {[
              "Istat",
              "C.N.R.",
              "Arma dei Carabinieri",
              "Ministero dello Sviluppo Economico",
              "Framar S.P.A. (Bergamo)",
              "New Planet (Milano)",
              "Scaramuzza Spa",
              "Selav Spa",
              "Mecfond Spa",
              "Museo Diocesano",
              "Italstage",
              "Institut Grenoble de Naples",
            ].map((name) => (
              <motion.span
                key={name}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ scale: 1.08, y: -2 }}
                transition={spring}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm shadow-slate-200/50 transition-colors hover:border-sky-200 hover:shadow-md"
              >
                {name}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 overflow-hidden rounded-2xl border-2 border-sky-200 bg-sky-50/80 px-6 py-8 sm:px-10 sm:py-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <motion.div
              className="mb-4 flex justify-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...spring, type: "spring", stiffness: 200 }}
            >
              <span className="text-4xl">📍</span>
            </motion.div>
            <h3 className="text-center text-lg font-bold text-slate-900 sm:text-xl">
              Presenza in condominiali a Napoli
            </h3>
            <p className="mt-2 text-center text-sm text-slate-600">
              Servizio di portierato attivo in diverse realtà sul territorio
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                { via: "Via Fiorentine", zona: "Chiaia" },
                { via: "Via Toledo", zona: "adiacente Galleria Umberto" },
                { via: "Via Marsicano", zona: "Materdei" },
                { via: "Via Figurelle", zona: "" },
                { via: "Via Martirano", zona: "zona orientale" },
              ].map(({ via, zona }, i) => (
                <motion.div
                  key={via}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="rounded-xl border border-sky-200 bg-white px-4 py-3 text-center shadow-sm transition-colors hover:border-sky-300 hover:shadow-md"
                >
                  <span className="font-semibold text-slate-900">{via}</span>
                  {zona && (
                    <span className="block text-sm text-slate-500">{zona}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ - domande frequenti (SEO e snippet Google) */}
      <section id="faq" className="relative scroll-mt-20 border-t border-slate-200 bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div className="text-center" {...fadeIn}>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              Domande frequenti
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Vigilanza non armata e portierato a Napoli: cosa sapere
            </h2>
          </motion.div>
          <dl className="mt-12 space-y-6">
            {[
              {
                q: "Cos'è la vigilanza non armata?",
                a: "La vigilanza non armata è un servizio di sorveglianza e controllo del territorio senza uso di armi. Include controllo accessi, verifica impianti, prevenzione incendi e allagamenti, registrazione presenze e tutto quanto concordato con il cliente, nel rispetto del D.M. n. 269/2010.",
              },
              {
                q: "Dove opera Il Gabbiano per vigilanza e portierato?",
                a: "Operiamo a Napoli e in tutta la Campania: condomini, aziende, uffici, centri commerciali e realtà che richiedono servizi di vigilanza non armata, portierato, front office e videosorveglianza.",
              },
              {
                q: "Come richiedere un preventivo per vigilanza o portierato?",
                a: "Puoi chiamarci al 331 998 9456 o passare in sede al Centro Direzionale Isola A/7 a Napoli. Forniamo preventivi gratuiti e su misura per vigilanza non armata, portierato e servizi d'ordine.",
              },
              {
                q: "Il personale è formato secondo la normativa?",
                a: "Sì. I nostri addetti sono formati e aggiornati secondo il D.M. n. 269/2010 e le disposizioni di pubblica sicurezza. Garantiamo professionalità, puntualità e piena conformità normativa.",
              },
            ].map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.08 }}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-6"
              >
                <dt className="text-lg font-bold text-slate-900">{faq.q}</dt>
                <dd className="mt-3 text-slate-600">{faq.a}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Cos'è la vigilanza non armata?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "La vigilanza non armata è un servizio di sorveglianza e controllo del territorio senza uso di armi. Include controllo accessi, verifica impianti, prevenzione incendi e allagamenti, registrazione presenze e tutto quanto concordato con il cliente, nel rispetto del D.M. n. 269/2010.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Dove opera Il Gabbiano per vigilanza e portierato?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Operiamo a Napoli e in tutta la Campania: condomini, aziende, uffici, centri commerciali e realtà che richiedono servizi di vigilanza non armata, portierato, front office e videosorveglianza.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Come richiedere un preventivo per vigilanza o portierato?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Puoi chiamarci al 331 998 9456 o passare in sede al Centro Direzionale Isola A/7 a Napoli. Forniamo preventivi gratuiti e su misura per vigilanza non armata, portierato e servizi d'ordine.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Il personale è formato secondo la normativa?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sì. I nostri addetti sono formati e aggiornati secondo il D.M. n. 269/2010 e le disposizioni di pubblica sicurezza. Garantiamo professionalità, puntualità e piena conformità normativa.",
                  },
                },
              ],
            }),
          }}
        />
      </section>

      {/* Contatti */}
      <section id="contatti" className="relative scroll-mt-20 border-t border-slate-200 bg-slate-900 py-24 text-white sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(14,165,233,0.15),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div className="text-center" {...fadeIn}>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">
              Contatti
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Parliamone
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Per preventivi e informazioni sui servizi di vigilanza non armata e portierato.
            </p>
          </motion.div>

          <motion.div
            className="mt-14 flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {},
            }}
          >
            <motion.a
              href="tel:+393319989456"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-600 bg-slate-800/50 px-8 py-6 transition-colors hover:border-sky-500 hover:bg-slate-800 hover:shadow-lg hover:shadow-sky-500/10"
            >
              <span className="text-3xl">📞</span>
              <span className="font-semibold">331 998 9456</span>
              <span className="text-sm text-slate-400">Cellulare</span>
            </motion.a>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={spring}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-600 bg-slate-800/50 px-8 py-6 transition-colors hover:border-sky-500 hover:bg-slate-800 hover:shadow-lg hover:shadow-sky-500/10"
            >
              <span className="text-3xl">📍</span>
              <span className="font-semibold text-center">Centro Direzionale Isola A/7 scala A</span>
              <span className="text-sm text-slate-400">80143 Napoli</span>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={spring}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-600 bg-slate-800/50 px-8 py-6 transition-colors hover:border-sky-500 hover:bg-slate-800 hover:shadow-lg hover:shadow-sky-500/10"
            >
              <span className="text-3xl">🏢</span>
              <span className="font-semibold">P.I. 05790181217</span>
              <span className="text-sm text-slate-400">Iscritta C.C. Napoli</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 bg-slate-950 py-8 text-slate-400">
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-600/50">
          <motion.div
            className="h-10 w-20"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <GabbianoIcon className="h-full w-full" />
          </motion.div>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm">
              © {new Date().getFullYear()} Il Gabbiano SRL. Tutti i diritti riservati.
            </p>
            <p className="text-sm">
              Antonietta Festinese — Amministratore Unico
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
