import { formatRupiah } from "@/lib/utils";
import type { OrderStatusSummary } from "@/types/order";

const STATUS_LABELS: Record<string, string> = {
  all: "All Orders",
  created: "Created",
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  ready_to_ship: "Ready to Ship",
  shipped: "Shipped",
  completed: "Completed",
  rts: "RTS",
  canceled: "Canceled",
};

interface OrderStatusGridProps {
  data: OrderStatusSummary[];
}

export function OrderStatusGrid({ data }: OrderStatusGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {data.map((item) => (
        <div key={item.status} className="bg-white border border-line rounded-lg p-4">
          <p className="text-[12px] text-ink-soft">{STATUS_LABELS[item.status]}</p>
          <p className="font-semibold mt-1 text-ink text-[14px] tabular-nums">{formatRupiah(item.total_amount)}</p>
          <p className="text-[12px] text-ink-soft tabular-nums">{item.count}</p>
        </div>
      ))}
    </div>
  );
}