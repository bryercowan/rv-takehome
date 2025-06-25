"use client";

import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";

interface Deal {
  deal_id: string;
  company_name: string;
  stage: string;
  transportation_mode: string;
  value: number;
  sales_rep: string;
  expected_close_date: string;
  territory: string;
}

type SortField = "deal_id" | "company_name" | "stage" | "value" | "sales_rep";
type SortDir = "asc" | "desc";

interface Props {
  territoryFilter: string | null;
  onCheckChange: (ids: string[]) => void;
}

const STAGE_COLOR: Record<string, string> = {
  prospect: "bg-blue-100 text-blue-800",
  qualified: "bg-green-100 text-green-800",
  proposal: "bg-yellow-100 text-yellow-800",
  negotiation: "bg-orange-100 text-orange-800",
  closed_won: "bg-emerald-100 text-emerald-800",
  closed_lost: "bg-red-100 text-red-800",
};

const STAGES = Object.keys(STAGE_COLOR);

export default function TerritoryTable({
  territoryFilter,
  onCheckChange,
}: Props) {
  const { data: deals = [], isLoading } = useQuery<Deal[]>({
    queryKey: ["deals"],
    queryFn: () => fetch("/api/deals/list").then((r) => r.json()),
  });

  const [search, setSearch] = useState("");
  const [stageChip, setStageChip] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("deal_id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [checked, setChecked] = useState<string[]>([]);
  useEffect(() => onCheckChange(checked), [checked]);

  const rows = useMemo(() => {
    let r = deals;
    if (territoryFilter) r = r.filter((d) => d.territory === territoryFilter);
    if (stageChip) r = r.filter((d) => d.stage === stageChip);

    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (d) =>
          d.company_name.toLowerCase().includes(q) ||
          d.deal_id.toLowerCase().includes(q) ||
          d.sales_rep.toLowerCase().includes(q)
      );
    }

    return [...r].sort((a, b) => {
      const A = a[sortField];
      const B = b[sortField];
      if (A === B) return 0;
      return sortDir === "asc" ? (A < B ? -1 : 1) : A < B ? 1 : -1;
    });
  }, [deals, territoryFilter, stageChip, search, sortField, sortDir]);

  const visibleIds = rows.map((d) => d.deal_id);
  const allChecked =
    visibleIds.length > 0 && visibleIds.every((id) => checked.includes(id));
  const toggleAll = () =>
    setChecked(
      allChecked
        ? checked.filter((id) => !visibleIds.includes(id))
        : [...checked, ...visibleIds]
    );

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
      </div>
    );

  return (
    <div className="space-y-4">
      {/* chip bar */}
      <div className="flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s}
            onClick={() => setStageChip(stageChip === s ? null : s)}
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-medium capitalize border",
              stageChip === s
                ? STAGE_COLOR[s] + " border-transparent"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            )}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* search bar */}
      <div className="relative max-w-md">
        <input
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Search deals…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          🔍
        </span>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
              </th>
              {[
                { key: "deal_id", label: "Deal" },
                { key: "company_name", label: "Company" },
                { key: "stage", label: "Stage" },
                { key: "value", label: "Value" },
                { key: "sales_rep", label: "Rep" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (key === sortField) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    else {
                      setSortField(key as SortField);
                      setSortDir("asc");
                    }
                  }}
                >
                  {label}
                  {sortField === key && <span>{sortDir === "asc" ? " ↑" : " ↓"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((d) => (
              <tr key={d.deal_id} className="hover:bg-gray-50">
                <td className="px-2">
                  <input
                    type="checkbox"
                    checked={checked.includes(d.deal_id)}
                    onChange={() =>
                      setChecked((cur) =>
                        cur.includes(d.deal_id)
                          ? cur.filter((x) => x !== d.deal_id)
                          : [...cur, d.deal_id]
                      )
                    }
                  />
                </td>
                <td className="px-4 py-3 font-medium">{d.deal_id}</td>
                <td className="px-4 py-3">{d.company_name}</td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      STAGE_COLOR[d.stage]
                    )}
                  >
                    {d.stage.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  ${d.value.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3">{d.sales_rep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
