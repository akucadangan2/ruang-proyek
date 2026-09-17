import { formatRupiah } from "@/lib/utils";

interface RevenueCardProps {
  grossRevenue: number;
  count: number;
}

export function RevenueCard({ grossRevenue, count }: RevenueCardProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="bg-sky-500 text-white rounded-lg p-4">
        <p className="text-[12px] opacity-90">Est. Gross Revenue</p>
        <p className="text-[20px] font-bold mt-1 tabular-nums">{formatRupiah(grossRevenue)}</p>
      </div>
      <div className="bg-orange-500 text-white rounded-lg p-4">
        <p className="text-[12px] opacity-90">Count</p>
        <p className="text-[20px] font-bold mt-1 tabular-nums">{count}</p>
      </div>
    </div>
  );
}