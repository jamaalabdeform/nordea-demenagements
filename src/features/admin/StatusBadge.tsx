import { cn } from "@/lib/format";
import { statusLabel, type LeadStatus } from "./leads";

const tone: Record<LeadStatus, string> = {
  nouveau: "bg-brick-100 text-brick-600",
  "a-rappeler": "bg-[#f3ead0] text-[#7a5a12]",
  "devis-prepare": "bg-stone-100 text-ink-2",
  "devis-envoye": "bg-forest-50 text-forest-700",
  relance: "bg-[#f3ead0] text-[#7a5a12]",
  accepte: "bg-forest-700 text-paper",
  perdu: "bg-stone-100 text-stone-600 line-through decoration-stone-500/50",
};

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return <span className={cn("inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-medium", tone[status], className)}>{statusLabel(status)}</span>;
}
