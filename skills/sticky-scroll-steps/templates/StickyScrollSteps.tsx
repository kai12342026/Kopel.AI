"use client"

/**
 * StickyScrollSteps
 * ─────────────────────────────────────────────────────────────
 * Scroll-driven "how it works" section: a list of steps on the
 * inline-start side, a sticky demo panel on the inline-end side.
 * The step crossing the viewport's centre band becomes active and
 * the panel crossfades to that step's demo.
 *
 * Reference: jobgether.com, "How Jobgether works".
 *
 * Theming: the component reads CSS variables only, never hex values.
 * Map them to the project's brand in its global CSS (see SKILL.md):
 *   --sss-accent       eyebrow, icon, link (must pass AA as text)
 *   --sss-bar          active-step bar (defaults to --sss-accent)
 *   --sss-brand-dark   step title
 *   --sss-muted        step description
 *   --sss-divider      1px divider between steps
 *   --sss-card         the "product mock" card surface
 *   --sss-panel-from / --sss-panel-via / --sss-panel-to
 *                      the panel's diagonal gradient stops
 * Missing tokens fall back to currentColor / Canvas / transparent,
 * so a forgotten mapping looks monochrome, never broken.
 *
 * Requires: React 18+, Tailwind 3.3+ or 4, and `cn` (clsx +
 * tailwind-merge) at "@/lib/utils" (the shadcn default).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

/* ── public types ─────────────────────────────────────────── */

export interface StickyStep {
  id: string
  /** Small label above the title, e.g. "Step 1" */
  eyebrow: string
  title: string
  description: ReactNode
  /** Decorative icon next to the eyebrow (rendered aria-hidden) */
  icon?: ReactNode
  link?: { label: string; href: string }
  /** The mini product UI shown in the panel for this step */
  demo: ReactNode
}

type Slot =
  | "heading"
  | "subheading"
  | "list"
  | "step"
  | "eyebrow"
  | "title"
  | "description"
  | "link"
  | "card"
  | "mobilePanel"

export interface StickyScrollStepsProps {
  heading?: ReactNode
  subheading?: ReactNode
  steps: StickyStep[]
  /**
   * CSS length for the panel's `top`. Should equal the sticky site
   * header's height + ~24px. Default reads `--site-header-h`.
   */
  stickyTop?: string
  /** Max panel height on desktop. It also shrinks to fit the viewport. */
  panelHeight?: string
  /** Classes for the gradient panel (desktop) */
  panelClassName?: string
  className?: string
  /** Per-slot class overrides, merged with tailwind-merge */
  classNames?: Partial<Record<Slot, string>>
  /** Opacity of inactive steps on desktop. Spec: 0.4 */
  inactiveOpacity?: number
  /**
   * IntersectionObserver rootMargin defining the focus band.
   * "-45% 0px -45% 0px" = a band at 45% to 55% of the viewport height.
   */
  focusBand?: string
}

/* ── demo context: lets a demo animate only while it is shown ── */

const StepActiveContext = createContext(true)

/**
 * Inside a step's `demo`: true while that demo is the visible one.
 * Always true in the stacked mobile layout.
 */
export function useStepActive() {
  return useContext(StepActiveContext)
}

/* ── internals ─────────────────────────────────────────────── */

const DESKTOP_QUERY = "(min-width: 1024px)" // Tailwind `lg`
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

/** Token resolution with neutral fallbacks, set once on the root. */
const TOKENS = {
  "--sss-c-accent": "var(--sss-accent, currentColor)",
  "--sss-c-bar": "var(--sss-bar, var(--sss-accent, currentColor))",
  "--sss-c-ink": "var(--sss-brand-dark, currentColor)",
  "--sss-c-muted": "var(--sss-muted, currentColor)",
  "--sss-c-divider":
    "var(--sss-divider, color-mix(in oklab, currentColor 14%, transparent))",
  "--sss-c-card": "var(--sss-card, Canvas)",
  "--sss-c-from":
    "var(--sss-panel-from, color-mix(in oklab, currentColor 6%, transparent))",
  "--sss-c-via": "var(--sss-panel-via, var(--sss-panel-from, transparent))",
  "--sss-c-to": "var(--sss-panel-to, transparent)",
} as const

function ArrowIcon() {
  // Drawn pointing to the inline end in LTR; mirrored in RTL so it
  // always points in the reading direction.
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0 rtl:-scale-x-100"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

/** Mobile: the demo card under its step, with a one-time fade-in. */
function MobileDemo({
  children,
  className,
  cardClassName,
}: {
  children: ReactNode
  className?: string
  cardClassName?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Hidden state is applied only after mount, so no-JS, crawlers and
  // reduced-motion users always get a visible demo.
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia(REDUCED_QUERY).matches) return
    if (typeof IntersectionObserver === "undefined") return
    setArmed(true)
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!armed || !node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [armed])

  return (
    <div
      ref={ref}
      className={cn(
        "relative mt-8 rounded-2xl px-3 pt-8 pb-3 transition-all duration-500 ease-out lg:hidden",
        "bg-[linear-gradient(135deg,var(--sss-c-from),var(--sss-c-via),var(--sss-c-to))]",
        armed && !shown && "translate-y-3 opacity-0",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-[color:var(--sss-c-card)] shadow-2xl",
          cardClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

/* ── component ─────────────────────────────────────────────── */

export function StickyScrollSteps({
  heading,
  subheading,
  steps,
  stickyTop = "calc(var(--site-header-h, 4.5rem) + 1.5rem)",
  panelHeight = "46.875rem",
  panelClassName,
  className,
  classNames = {},
  inactiveOpacity = 0.4,
  focusBand = "-45% 0px -45% 0px",
}: StickyScrollStepsProps) {
  const uid = useId()
  const headingId = `${uid}-heading`
  const [active, setActive] = useState(0)

  const stepRefs = useRef<(HTMLLIElement | null)[]>([])
  /** Index being scrolled to after a click; observer updates pause. */
  const lockRef = useRef<number | null>(null)
  const unlockRef = useRef<(() => void) | null>(null)

  /* Scroll tracking: IntersectionObserver over a centre band. */
  useEffect(() => {
    const nodes = stepRefs.current.slice(0, steps.length)
    if (typeof IntersectionObserver === "undefined" || nodes.some((n) => !n))
      return

    const inBand = new Set<number>()

    const pick = () => {
      if (lockRef.current !== null) return

      if (inBand.size > 0) {
        // Several steps can touch the band at a boundary: take the
        // one whose box is nearest the viewport centre.
        const centre = window.innerHeight / 2
        let best = -1
        let bestDistance = Infinity
        inBand.forEach((index) => {
          const r = nodes[index]!.getBoundingClientRect()
          const distance =
            r.top <= centre && r.bottom >= centre
              ? 0
              : Math.min(Math.abs(r.top - centre), Math.abs(r.bottom - centre))
          if (distance < bestDistance) {
            bestDistance = distance
            best = index
          }
        })
        if (best >= 0) setActive(best)
        return
      }

      // Nothing in the band: above the list keep the first step,
      // below it keep the last one (also covers loading mid-page).
      const last = nodes[nodes.length - 1]!.getBoundingClientRect()
      if (last.bottom < window.innerHeight / 2) setActive(nodes.length - 1)
      else if (nodes[0]!.getBoundingClientRect().top > window.innerHeight / 2)
        setActive(0)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = nodes.indexOf(entry.target as HTMLLIElement)
          if (entry.isIntersecting) inBand.add(index)
          else inBand.delete(index)
        }
        pick()
      },
      { rootMargin: focusBand, threshold: 0 }
    )

    nodes.forEach((node) => observer.observe(node!))
    return () => observer.disconnect()
  }, [steps.length, focusBand])

  /* Release a pending click-scroll lock on unmount. */
  useEffect(() => () => unlockRef.current?.(), [])

  const activate = useCallback((index: number) => {
    setActive(index)

    const node = stepRefs.current[index]
    if (!node || !window.matchMedia(DESKTOP_QUERY).matches) return

    unlockRef.current?.()
    lockRef.current = index

    const controller = new AbortController()
    const timer = window.setTimeout(() => unlock(), 1200)
    function unlock() {
      lockRef.current = null
      unlockRef.current = null
      window.clearTimeout(timer)
      controller.abort()
    }
    unlockRef.current = unlock
    // `scrollend` ends the lock as soon as the smooth scroll settles;
    // the timer covers browsers without it and no-op scrolls.
    window.addEventListener("scrollend", unlock, {
      once: true,
      signal: controller.signal,
    })

    const reduced = window.matchMedia(REDUCED_QUERY).matches
    node.scrollIntoView({
      behavior: reduced ? "instant" : "smooth",
      block: "center",
    })
  }, [])

  const onStepClick = (index: number) => (event: MouseEvent) => {
    // Let the step's own link navigate without hijacking the click.
    if ((event.target as Element).closest("a")) return
    activate(index)
  }

  const rootStyle = {
    ...TOKENS,
    "--sss-top": stickyTop,
    "--sss-panel-h": `min(${panelHeight}, calc(100svh - var(--sss-top) - 1.5rem))`,
    // Run-out after the last step: without it the panel unpins before
    // the last step reaches the viewport centre, and its demo would
    // crossfade while the panel is already scrolling away. The panel's
    // bottom edge (top + height) minus the centre line, minus 6rem for
    // half of the shortest realistic step (py-12 alone is 6rem).
    "--sss-tail":
      "max(0px, calc(var(--sss-top) + var(--sss-panel-h) - 50svh - 6rem))",
    "--sss-inactive": String(inactiveOpacity),
  } as CSSProperties

  const Root = heading ? "section" : "div"

  return (
    <Root
      aria-labelledby={heading ? headingId : undefined}
      className={cn("relative", className)}
      style={rootStyle}
    >
      {(heading || subheading) && (
        <div className="mb-12 max-w-2xl lg:mb-16">
          {heading && (
            <h2
              id={headingId}
              className={cn(
                "text-3xl font-bold text-[color:var(--sss-c-ink)] md:text-4xl",
                classNames.heading
              )}
            >
              {heading}
            </h2>
          )}
          {subheading && (
            <p
              className={cn(
                "mt-4 text-lg text-[color:var(--sss-c-muted)]",
                classNames.subheading
              )}
            >
              {subheading}
            </p>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2 lg:gap-16">
        {/* ── Column A: steps ── */}
        <ol className={cn("lg:pb-[var(--sss-tail)]", classNames.list)}>
          {steps.map((step, index) => {
            const isActive = index === active
            return (
              <li
                key={step.id}
                ref={(node) => {
                  stepRefs.current[index] = node
                }}
                aria-current={isActive ? "step" : undefined}
                onClick={onStepClick(index)}
                className={cn(
                  "border-t border-[color:var(--sss-c-divider)] py-12",
                  "transition-all duration-500 ease-in-out motion-reduce:transition-none",
                  "lg:cursor-pointer",
                  isActive
                    ? "lg:border-s-4 lg:border-s-[color:var(--sss-c-bar)] lg:ps-6 lg:opacity-100"
                    : // focus-within: a keyboard user must see the focus ring at full strength
                      "lg:opacity-[var(--sss-inactive)] lg:focus-within:opacity-100 lg:hover:opacity-70",
                  classNames.step
                )}
              >
                <div className="mb-4 flex items-center gap-3">
                  {step.icon && (
                    <span
                      aria-hidden="true"
                      className="inline-flex size-5 shrink-0 items-center justify-center text-[color:var(--sss-c-accent)] [&_svg]:size-5"
                    >
                      {step.icon}
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-[0.8rem] font-semibold tracking-wider text-[color:var(--sss-c-accent)] uppercase",
                      classNames.eyebrow
                    )}
                  >
                    {step.eyebrow}
                  </span>
                </div>

                <h3
                  className={cn(
                    "mb-3 text-xl font-bold text-[color:var(--sss-c-ink)]",
                    classNames.title
                  )}
                >
                  {/* Native button = Tab focus + Enter/Space for free */}
                  <button
                    type="button"
                    aria-controls={`${uid}-demo-${index}`}
                    className="rounded-sm text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sss-c-accent)] lg:cursor-pointer"
                  >
                    {step.title}
                  </button>
                </h3>

                <div
                  className={cn(
                    "leading-relaxed text-[color:var(--sss-c-muted)]",
                    classNames.description
                  )}
                >
                  {step.description}
                </div>

                {step.link && (
                  <a
                    href={step.link.href}
                    className={cn(
                      "mt-5 inline-flex items-center gap-1.5 font-semibold text-[color:var(--sss-c-accent)] transition-[gap] duration-200 hover:gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--sss-c-accent)]",
                      classNames.link
                    )}
                  >
                    {step.link.label}
                    <ArrowIcon />
                  </a>
                )}

                {/* Mobile: the demo sits right under its step */}
                <MobileDemo
                  className={classNames.mobilePanel}
                  cardClassName={classNames.card}
                >
                  {step.demo}
                </MobileDemo>
              </li>
            )
          })}
        </ol>

        {/* ── Column B: sticky demo panel (desktop only) ── */}
        <div className="hidden lg:block">
          <div className="sticky top-[var(--sss-top)]">
            <div
              className={cn(
                "relative h-[var(--sss-panel-h)] overflow-hidden rounded-2xl",
                "bg-[linear-gradient(135deg,var(--sss-c-from),var(--sss-c-via),var(--sss-c-to))]",
                panelClassName
              )}
            >
              <div
                className={cn(
                  "absolute inset-x-4 top-10 bottom-4 overflow-hidden rounded-xl bg-[color:var(--sss-c-card)] shadow-2xl",
                  classNames.card
                )}
              >
                {steps.map((step, index) => {
                  const isActive = index === active
                  return (
                    <div
                      key={step.id}
                      id={`${uid}-demo-${index}`}
                      aria-hidden={!isActive}
                      ref={(node) => {
                        // `inert` via the DOM works on React 18 and 19
                        if (node) node.inert = !isActive
                      }}
                      className={cn(
                        "absolute inset-0 transition-all duration-500 ease-in-out motion-reduce:translate-y-0 motion-reduce:transition-none",
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-2.5 opacity-0"
                      )}
                    >
                      <StepActiveContext.Provider value={isActive}>
                        {step.demo}
                      </StepActiveContext.Provider>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Root>
  )
}
