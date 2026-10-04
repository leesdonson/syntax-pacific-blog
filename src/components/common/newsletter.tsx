"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./button";

type Status = "idle" | "invalid" | "done";

/** Newsletter capture — local-only submit, no network dependency. */
export function Newsletter({ className }: { readonly className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setStatus(valid ? "done" : "invalid");
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-8 backdrop-blur-md sm:p-10",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-10 grid-bg opacity-40" />
      <div
        aria-hidden
        className="absolute -right-16 -top-16 size-56 rounded-full bg-accent/15 blur-[90px]"
      />

      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent">
            <Mail aria-hidden className="size-3" />
            weekly · no spam
          </span>
          <h2
            id="newsletter-heading"
            className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            One deep dive, every Thursday.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Rendering internals, type-level tricks and performance postmortems —
            written for engineers who read the source. Unsubscribe in one click.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm lg:w-auto lg:min-w-88"
          noValidate
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div
              className={cn(
                "flex flex-1 items-center rounded-xl border bg-elevated/80 px-4 transition-colors",
                status === "invalid"
                  ? "border-rose-500/60"
                  : "border-line focus-within:border-accent/60",
              )}
            >
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="you@yourdomain.dev"
                aria-invalid={status === "invalid"}
                aria-describedby="newsletter-status"
                className="h-11 w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Send className="size-4" />}
              iconPosition="right"
            >
              Subscribe
            </Button>
          </div>

          <p
            id="newsletter-status"
            aria-live="polite"
            className="mt-3 min-h-5 font-mono text-xs"
          >
            {status === "invalid" ? (
              <span className="text-rose-400">
                ✗ that address does not look valid
              </span>
            ) : status === "done" ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 text-emerald-glow"
              >
                <CheckCircle2 className="size-3.5" aria-hidden /> subscribed —
                check your inbox
              </motion.span>
            ) : (
              <span className="text-ink-faint">
                2,481 engineers already on the list
              </span>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
