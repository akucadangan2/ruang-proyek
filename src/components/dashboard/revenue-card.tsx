import { formatRupiah } from "@/lib/utils";

interface RevenueCardProps {
  grossRevenue: number;
  count: number;
}

export function RevenueCard({ grossRevenue, count }: RevenueCardProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="bg-ink text-white rounded-lg p-4">
        <p className="text-[12px] text-white/50">Est. Gross Revenue</p>
        <p className="text-[22px] font-bold mt-1 tabular-nums">{formatRupiah(grossRevenue)}</p>
      </div>
      <div className="bg-white border border-line rounded-lg p-4">
        <p className="text-[12px] text-ink-soft">Count</p>
        <p className="text-[22px] font-bold mt-1 text-ink tabular-nums">{count}</p>
      </div>
    </div>
  );
}