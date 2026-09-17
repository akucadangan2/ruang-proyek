"use client";

import { useEffect, useRef, useState } from "react";
import { IconCalendar, IconChevronLeft, IconChevronRight } from "@/components/ui/icons";

interface DateRangePickerProps {
  value: { from: string; to: string }; // format YYYY-MM-DD
  onChange: (range: { from: string; to: string }) => void;
}

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatShort(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = String(date.getFullYear()).slice(2);
  return `${day} ${month} ${year}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getMonthGrid(year: number, month0: number): Date[] {
  const firstOfMonth = new Date(year, month0, 1);
  const dayOfWeek = firstOfMonth.getDay(); // 0=Sun..6=Sat
  const offset = (dayOfWeek + 6) % 7; // Monday-start offset
  const gridStart = addDays(firstOfMonth, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

function getPresets(): { label: string; range: () => { from: Date; to: Date } }[] {
  const today = startOfDay(new Date());
  return [
    { label: "Today", range: () => ({ from: today, to: today }) },
    { label: "Yesterday", range: () => ({ from: addDays(today, -1), to: addDays(today, -1) }) },
    {
      label: "This week",
      range: () => {
        const offset = (today.getDay() + 6) % 7;
        return { from: addDays(today, -offset), to: today };
      },
    },
    { label: "Last 1 week", range: () => ({ from: addDays(today, -7), to: today }) },
    { label: "Last 2 weeks", range: () => ({ from: addDays(today, -14), to: today }) },
    {
      label: "This month",
      range: () => ({ from: new Date(today.getFullYear(), today.getMonth(), 1), to: today }),
    },
    {
      label: "1 bulan terakhir",
      range: () => {
        const from = new Date(today);
        from.setMonth(from.getMonth() - 1);
        return { from, to: today };
      },
    },
  ];
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState<Date>(fromISO(value.from));
  const [rangeEnd, setRangeEnd] = useState<Date>(fromISO(value.to));
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<Date>(fromISO(value.to));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setPendingStart(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function applyRange(from: Date, to: Date) {
    const [a, b] = from <= to ? [from, to] : [to, from];
    setRangeStart(a);
    setRangeEnd(b);
    onChange({ from: toISO(a), to: toISO(b) });
    setOpen(false);
    setPendingStart(null);
  }

  function handleDayClick(date: Date) {
    if (!pendingStart) {
      setPendingStart(date);
    } else {
      applyRange(pendingStart, date);
    }
  }

  function handlePreset(preset: { from: Date; to: Date }) {
    setViewMonth(preset.to);
    applyRange(preset.from, preset.to);
  }

  const leftMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
  const rightMonth = viewMonth;

  function isInRange(date: Date): boolean {
    const effectiveEnd = pendingStart ? hoverDate ?? pendingStart : rangeEnd;
    const effectiveStart = pendingStart ?? rangeStart;
    if (!effectiveEnd) return false;
    const [a, b] = effectiveStart <= effectiveEnd ? [effectiveStart, effectiveEnd] : [effectiveEnd, effectiveStart];
    return date >= a && date <= b;
  }

  function isEndpoint(date: Date): boolean {
    const s = pendingStart ?? rangeStart;
    const e = pendingStart ? hoverDate ?? pendingStart : rangeEnd;
    return date.getTime() === s?.getTime() || date.getTime() === e?.getTime();
  }

  function renderMonth(monthDate: Date, showPrevArrow: boolean, showNextArrow: boolean) {
    const grid = getMonthGrid(monthDate.getFullYear(), monthDate.getMonth());
    const today = startOfDay(new Date());

    return (
      <div className="w-64">
        <div className="flex items-center justify-between mb-3">
          {showPrevArrow ? (
            <button
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              className="text-accent hover:text-accent/70"
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <span className="w-4" />
          )}
          <p className="font-semibold text-[13px] text-ink">
            {monthDate.toLocaleDateString("en-US", { month: "short" })} {monthDate.getFullYear()}
          </p>
          {showNextArrow ? (
            <button
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              className="text-accent hover:text-accent/70"
            >
              <IconChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="w-4" />
          )}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-ink py-1">
              {d}
            </div>
          ))}
          {grid.map((date, i) => {
            const isCurrentMonth = date.getMonth() === monthDate.getMonth();
            const inRange = isInRange(date);
            const endpoint = isEndpoint(date);
            const isToday = date.getTime() === today.getTime();

            return (
              <button
                key={i}
                onClick={() => handleDayClick(date)}
                onMouseEnter={() => pendingStart && setHoverDate(date)}
                className={`h-8 text-[12px] flex items-center justify-center relative ${
                  isCurrentMonth ? "text-ink" : "text-line"
                }`}
              >
                <span
                  className={`absolute inset-y-0.5 ${inRange ? "bg-accent-soft" : ""} ${
                    date.getDay() === 1 || i % 7 === 0 ? "rounded-l-full left-0.5" : "-left-px"
                  } ${date.getDay() === 0 || i % 7 === 6 ? "rounded-r-full right-0.5" : "-right-px"}`}
                  style={{ zIndex: 0 }}
                />
                <span
                  className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full ${
                    endpoint ? "bg-ink text-white font-medium" : ""
                  } ${isToday && !endpoint ? "ring-1 ring-accent" : ""}`}
                >
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-line rounded-lg px-3 py-2 bg-white text-[13px] text-ink"
      >
        <IconCalendar className="w-4 h-4 text-ink-soft" />
        {formatShort(rangeStart)} - {formatShort(rangeEnd)}
      </button>

      {open && (
        <div className="absolute z-20 top-full left-0 mt-2 bg-white border border-line rounded-lg shadow-lg flex">
          <div className="w-40 border-r border-line py-3">
            {getPresets().map((preset) => {
              const p = preset.range();
              const isActive = toISO(p.from) === toISO(rangeStart) && toISO(p.to) === toISO(rangeEnd);
              return (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(p)}
                  className={`block w-full text-left px-4 py-2 text-[13px] hover:bg-paper ${
                    isActive ? "text-accent font-medium" : "text-ink-soft"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-6 p-4">
            {renderMonth(leftMonth, true, false)}
            {renderMonth(rightMonth, false, true)}
          </div>
        </div>
      )}
    </div>
  );
}