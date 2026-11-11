"use client"

/**
 * Example: a 3-step "How it works" section.
 *
 * 1. Copy StickyScrollSteps.tsx into the project's components folder.
 * 2. Map the tokens to the project's brand in its global CSS, e.g.:
 *
 *      :root {
 *        --sss-accent:     var(--brand-600);   // text-safe accent (AA)
 *        --sss-bar:        var(--sss-accent);
 *        --sss-brand-dark: var(--brand-950);
 *        --sss-muted:      var(--gray-600);
 *        --sss-divider:    var(--gray-200);
 *        --sss-card:       var(--card);
 *        --sss-panel-from: color-mix(in oklch, var(--primary) 15%, transparent);
 *        --sss-panel-via:  color-mix(in oklch, var(--accent-brand) 12%, transparent);
 *        --sss-panel-to:   color-mix(in oklch, var(--primary) 8%, transparent);
 *        --site-header-h:  4.5rem;            // height of the sticky header
 *      }
 *
 *    Never paste the reference colours. Use the project's own tokens.
 * 3. Texts come from the project's i18n layer. Literals here are only
 *    for the example.
 */

import { CheckIcon, PlugIcon, Settings2Icon, RocketIcon } from "lucide-react"

import {
  StickyScrollSteps,
  useStepActive,
  type StickyStep,
} from "@/components/sticky-scroll-steps"
import { cn } from "@/lib/utils"

/* ── mini demos: plain JSX, no images ─────────────────────── */

function DemoFrame({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  // Fills the fixed-height desktop card; grows naturally on mobile.
  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <p className="text-sm font-semibold text-[color:var(--sss-brand-dark)]">
        {title}
      </p>
      <div className="flex flex-1 flex-col gap-3">{children}</div>
    </div>
  )
}

function ConnectDemo() {
  const active = useStepActive()
  const tools = ["Calendar", "CRM", "Inbox"]
  return (
    <DemoFrame title="Connect your tools">
      {tools.map((tool, i) => (
        <div
          key={tool}
          className="flex items-center justify-between rounded-lg border border-[color:var(--sss-divider)] px-4 py-3"
        >
          <span className="text-sm">{tool}</span>
          <span
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-full bg-[color:var(--sss-accent)] text-[color:var(--sss-card)] transition-all duration-500 motion-reduce:transition-none",
              active ? "scale-100 opacity-100" : "scale-50 opacity-0"
            )}
            // Ticks land one after another while the demo is visible
            style={{ transitionDelay: active ? `${200 + i * 250}ms` : "0ms" }}
          >
            <CheckIcon className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      ))}
    </DemoFrame>
  )
}

function ConfigureDemo() {
  const active = useStepActive()
  return (
    <DemoFrame title="Setup progress">
      <div className="h-2 overflow-hidden rounded-full bg-[color:var(--sss-divider)]">
        <div
          className="h-full rounded-full bg-[color:var(--sss-accent)] transition-[width] duration-1000 ease-out motion-reduce:transition-none"
          style={{ width: active ? "68%" : "0%" }}
        />
      </div>
      <p className="text-sm text-[color:var(--sss-muted)] tabular-nums">
        68% complete
      </p>
    </DemoFrame>
  )
}

function LaunchDemo() {
  const items = ["Go live", "Team training", "Monthly review"]
  return (
    <DemoFrame title="Launch timeline">
      <ol className="flex flex-col gap-4 border-s-2 border-[color:var(--sss-divider)] ps-5">
        {items.map((item) => (
          <li key={item} className="text-sm">
            {item}
          </li>
        ))}
      </ol>
    </DemoFrame>
  )
}

/* ── the section ──────────────────────────────────────────── */

const steps: StickyStep[] = [
  {
    id: "connect",
    eyebrow: "Step 1",
    title: "Connect your tools",
    description: "Link the calendar, CRM and inbox you already use.",
    icon: <PlugIcon />,
    link: { label: "Learn more", href: "#connect" },
    demo: <ConnectDemo />,
  },
  {
    id: "configure",
    eyebrow: "Step 2",
    title: "Configure the flow",
    description: "Pick what happens when a new lead comes in.",
    icon: <Settings2Icon />,
    demo: <ConfigureDemo />,
  },
  {
    id: "launch",
    eyebrow: "Step 3",
    title: "Launch and improve",
    description: "Go live, then tune it with real data every month.",
    icon: <RocketIcon />,
    link: { label: "See pricing", href: "#pricing" },
    demo: <LaunchDemo />,
  },
]

export function HowItWorks() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
      <StickyScrollSteps
        heading="How it works"
        subheading="Three steps from sign-up to results."
        steps={steps}
        // Optional: override the default `calc(var(--site-header-h) + 1.5rem)`
        // stickyTop="6rem"
      />
    </div>
  )
}
