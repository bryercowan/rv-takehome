"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import clsx from "clsx";

interface Stat {
  territory: string;
  openValue: number;
  wonValue: number;
  dealCount: number;
}

interface Props {
  territoryStats: Stat[];        // GET /api/territories result
  deals: any[];                  // raw deal list (already in cache)
  selected: string | null;       // selected territory from map
}

function currency(v: number) {
  return `$${v.toLocaleString()}`;
}

export default function TerritoryInsights({
  territoryStats,
  deals,
  selected,
}: Props) {
  const scope = selected ?? "All Territories";

  const scopedStats = selected
    ? territoryStats.filter((s) => s.territory === selected)
    : territoryStats;

  const pipelineTotal = scopedStats.reduce((s, t) => s + t.openValue, 0);
  const wonTotal = scopedStats.reduce((s, t) => s + t.wonValue, 0);
  const avgDeal =
    pipelineTotal /
    (scopedStats.reduce((c, t) => c + t.dealCount, 0) || 1);

  const trend = useMemo(() => {
    const map = new Map<string, number>();
    deals
      .filter(
        (d) =>
          d.stage === "closed_won" &&
          (selected ? d.territory === selected : true)
      )
      .forEach((d) => {
        const month = new Date(d.expected_close_date).toLocaleString("en-US", {
          month: "short",
        });
        map.set(month, (map.get(month) ?? 0) + d.value);
      });

    return Array.from(map.entries()).slice(-6).map(([month, won]) => ({
      month,
      won,
    }));
  }, [deals, selected]);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-lg font-semibold mb-1">{scope} – KPIs</h2>

      <div className="grid sm:grid-cols-3 gap-4">
        <MetricCard label="Open Pipeline" value={currency(pipelineTotal)} />
        <MetricCard label="Closed-Won YTD" value={currency(wonTotal)} />
        <MetricCard label="Avg Deal" value={currency(Math.round(avgDeal))} />
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip formatter={(v: number) => currency(v)} />
            <Area
              type="monotone"
              dataKey="won"
              stroke="#2563eb"
              fill="rgba(37,99,235,0.15)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={clsx(
        "rounded border border-gray-200 p-4 flex flex-col justify-between"
      )}
    >
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
