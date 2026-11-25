"use client"

import { useState, useEffect } from "react"
import GlassFolder from "@/components/ui/glass-folder-cards"

/**
 * Three folders on a dotted desk: milk glass over a long-exposure print with a
 * key that adds files, a plain archive with a menu, and smoked glass over red
 * ink. Hover one to lean its glass toward you, click it to open it.
 */
export default function GlassFolderCardsDemo() {
  const [folderWidth, setFolderWidth] = useState<number>(() => {
    return typeof window !== "undefined" ? Math.min(320, Math.max(260, window.innerWidth - 32)) : 320
  })

  useEffect(() => {
    const handleResize = () => {
      setFolderWidth(Math.min(320, Math.max(260, window.innerWidth - 32)))
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background px-3 sm:px-6 py-12 sm:py-16"
      style={{ minHeight: "100svh" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground opacity-[0.13]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative grid max-w-[1180px] grid-cols-1 items-end justify-items-center gap-x-14 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        <GlassFolder label="My Files" art="aurora" seed={3} appearDelay={0} width={folderWidth} />
        <GlassFolder
          label="Archives"
          art="none"
          action="more"
          labelPlacement="top-left"
          appearDelay={140}
          width={folderWidth}
          files={[
            { name: "Lookbook 2024", meta: "38 images", art: "dusk" },
            { name: "Invoices", meta: "12 PDFs" },
            { name: "Shoot — Lisbon", meta: "RAW · 2.1 GB", art: "ember" },
            { name: "Contract.pdf", meta: "PDF · 320 KB" },
          ]}
          menu={[{ label: "Rename" }, { label: "Share…" }, { label: "Move to Trash", danger: true }]}
        />
        <GlassFolder
          label="My Files"
          meta="Wed 19 Aug"
          tone="dark"
          art="ember"
          seed={11}
          action="none"
          labelPlacement="top-right"
          appearDelay={280}
          width={folderWidth}
          files={[
            { name: "Stills", meta: "64 images", art: "verdant" },
            { name: "Edit notes", meta: "TXT · 4 KB" },
            { name: "Grade v3", meta: "DRX · 18 MB", art: "aurora" },
          ]}
        />
      </div>
      <p className="relative mt-14 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase text-center px-4">
        Hover to lean · Click to open · + to add
      </p>
    </div>
  )
}
