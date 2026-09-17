"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { IconCheckCircle, IconChevronUp, IconChevronDown } from "@/components/ui/icons";

interface PixelEventLog {
  id: string;
  platform: string;
  event_name: string;
  status: "success" | "failed";
  payload: unknown;
  response: unknown;
  sent_at: string;
  pixels: { pixel_name: string } | null;
}

export function PixelEventLog({ orderId }: { orderId: string }) {
  const [logs, setLogs] = useState<PixelEventLog[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedPayload, setExpandedPayload] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}/pixel-events`)
      .then((res) => res.json())
      .then(({ data }) => setLogs(data ?? []));
  }, [orderId]);

  if (logs.length === 0) return null;

  const latest = logs[0];
  const rest = logs.slice(1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[15px] text-gray-900">
          {latest.event_name} Event {latest.status === "success" ? "Triggered" : "Gagal"}
        </p>
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-gray-600">
          {collapsed ? <IconChevronDown className="w-4 h-4" /> : <IconChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 space-y-3">
          <EventRow
            log={latest}
            expanded={expandedPayload === latest.id}
            onTogglePayload={() => setExpandedPayload(expandedPayload === latest.id ? null : latest.id)}
          />

          {showHistory &&
            rest.map((log) => (
              <EventRow
                key={log.id}
                log={log}
                expanded={expandedPayload === log.id}
                onTogglePayload={() => setExpandedPayload(expandedPayload === log.id ? null : log.id)}
              />
            ))}

          {rest.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="block w-full text-center text-[13px] text-blue-600 font-medium pt-1"
            >
              {showHistory ? "Hide" : "Show"} Purchase Event History
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function EventRow({
  log,
  expanded,
  onTogglePayload,
}: {
  log: PixelEventLog;
  expanded: boolean;
  onTogglePayload: () => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-2 mb-2">
        <IconCheckCircle
          className={`w-4 h-4 mt-0.5 shrink-0 ${log.status === "success" ? "text-green-600" : "text-red-500"}`}
        />
        <p className="text-[13px] text-gray-700">
          Pengiriman event {log.event_name.toLowerCase()} ke{" "}
          <span className="font-semibold text-gray-900">
            {log.platform === "facebook" ? "Meta CAPI" : log.platform}
          </span>{" "}
          {log.status === "success" ? "telah dikonfirmasi." : "gagal dikirim."}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-[13px] ml-6">
        <p className="text-gray-700">
          Pixel ID: <span className="font-semibold text-gray-900">{log.pixels?.pixel_name ?? "-"}</span>
        </p>
        <p className="text-gray-500 mt-0.5">At: {formatDate(log.sent_at)}</p>
        <button onClick={onTogglePayload} className="text-blue-600 font-medium mt-1">
          See Payload
        </button>
        {expanded && (
          <pre className="mt-2 bg-white border border-gray-200 rounded p-2 text-[11px] overflow-x-auto font-mono">
            {JSON.stringify(log.payload, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}