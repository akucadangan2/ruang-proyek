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
  const [showHistory, setShowHistory] = useState(true);
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
    <div className="border border-line rounded-lg bg-white p-4">
      <p className="font-semibold text-[13px] text-ink mb-3">
        {latest.event_name} Event {latest.status === "success" ? "Triggered" : "Gagal"}
      </p>

      <EventRow log={latest} expanded={expandedPayload === latest.id} onTogglePayload={() =>
        setExpandedPayload(expandedPayload === latest.id ? null : latest.id)
      } />

      {rest.length > 0 && (
        <>
          {showHistory && (
            <div className="mt-2 space-y-2">
              {rest.map((log) => (
                <EventRow
                  key={log.id}
                  log={log}
                  expanded={expandedPayload === log.id}
                  onTogglePayload={() => setExpandedPayload(expandedPayload === log.id ? null : log.id)}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-[12px] text-accent font-medium mt-3"
          >
            {showHistory ? "Sembunyikan" : "Tampilkan"} Riwayat Purchase Event
            {showHistory ? <IconChevronUp className="w-3 h-3" /> : <IconChevronDown className="w-3 h-3" />}
          </button>
        </>
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
    <div className="bg-paper border border-line rounded-md p-3">
      <div className="flex items-start gap-2 mb-2">
        <IconCheckCircle
          className={`w-4 h-4 mt-0.5 shrink-0 ${log.status === "success" ? "text-positive" : "text-negative"}`}
        />
        <p className="text-[12px] text-ink">
          Pengiriman event {log.event_name.toLowerCase()} ke{" "}
          <span className="font-medium">
            {log.platform === "facebook" ? "Meta CAPI" : log.platform}
          </span>{" "}
          {log.status === "success" ? "telah dikonfirmasi." : "gagal dikirim."}
        </p>
      </div>

      <div className="bg-white border border-line rounded-md p-2.5 text-[11px] text-ink-soft">
        <p>Pixel ID: {log.pixels?.pixel_name ?? "-"}</p>
        <p className="mt-0.5">At: {formatDate(log.sent_at)}</p>
        <button onClick={onTogglePayload} className="text-accent font-medium mt-1">
          {expanded ? "Sembunyikan Payload" : "See Payload"}
        </button>
        {expanded && (
          <pre className="mt-2 bg-paper border border-line rounded p-2 text-[10px] overflow-x-auto font-mono">
            {JSON.stringify(log.payload, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}