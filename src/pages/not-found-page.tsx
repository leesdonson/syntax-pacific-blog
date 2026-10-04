"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Home } from "lucide-react";
import { Button } from "@/components/common/button";
import { GridBackdrop } from "@/components/ui/grid-backdrop";

export default function NotFoundPage() {
  return (
    <section className="relative grid min-h-[80vh] place-items-center px-4">
      <GridBackdrop />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg rounded-2xl border border-line bg-surface/50 p-8 text-center backdrop-blur-md"
      >
        <p className="font-mono text-6xl font-semibold text-accent text-glow">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          Route not found
        </h1>
        <pre className="mt-5 overflow-x-auto rounded-xl border border-line bg-[#0a0e17] p-4 text-left font-mono text-xs leading-relaxed text-slate-400">
          <code>
            {"$ devlog resolve --path " +
              (typeof window !== "undefined" ? window.location.pathname : "/") +
              "\n"}
            {"  error: ENOENT — no such article or route\n"}
            {"  hint: try the index"}
          </code>
        </pre>
        <Link href="/" className="mt-6 inline-flex">
          <Button
            variant="primary"
            size="md"
            icon={<Home className="size-4" />}
            tabIndex={-1}
          >
            Back to index
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
