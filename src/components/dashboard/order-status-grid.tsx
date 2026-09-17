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
        <div key={item.status} className="flex flex-col gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[12px] text-gray-400">{STATUS_LABELS[item.status]}</p>
            <p className="font-semibold text-[15px] text-gray-900 mt-1 tabular-nums">
              {formatRupiah(item.total_amount)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-[12px] text-gray-400">{STATUS_LABELS[item.status]}</p>
            <p className="font-semibold text-[15px] text-gray-900 mt-1 tabular-nums">{item.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}