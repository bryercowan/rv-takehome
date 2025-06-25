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
  probability: number;
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

export default function TerritoryTable({
  territoryFilter,
  onCheckChange,
}: Props) {
  const { data: deals = [], isLoading } = useQuery<Deal[]>({
    queryKey: ["deals"],
    queryFn: () => fetch("/api/deals/list").then((r) => r.json()),
  });

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("deal_id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => onCheckChange(checked), [checked]);

  const stageColor = (s: string) =>
  ({
    prospect: "bg-blue-100 text-blue-800",
    qualified: "bg-green-100 text-green-800",
    proposal: "bg-yellow-100 text-yellow-800",
    negotiation: "bg-orange-100 text-orange-800",
    closed_won: "bg-emerald-100 text-emerald-800",
    closed_lost: "bg-red-100 text-red-800",
  }[s as keyof any] ?? "bg-gray-100 text-gray-800");

  const fmtCurr = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  const toggleRow = (id: string) =>
    setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const rows = useMemo(() => {
    let r = territoryFilter ? deals.filter((d) => d.territory === territoryFilter) : deals;

    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (d) =>
          d.deal_id.toLowerCase().includes(q) ||
          d.company_name.toLowerCase().includes(q) ||
          d.sales_rep.toLowerCase().includes(q) ||
          d.stage.toLowerCase().includes(q)
      );
    }

    r = [...r].sort((a, b) => {
      const A = a[sortField];
      const B = b[sortField];
      if (A === B) return 0;
      return sortDir === "asc" ? (A < B ? -1 : 1) : A < B ? 1 : -1;
    });

    return r;
  }, [deals, territoryFilter, search, sortField, sortDir]);

  const visibleIds = rows.map((d) => d.deal_id);
  const allChecked = visibleIds.length > 0 && visibleIds.every((id) => checked.includes(id));
  const toggleAll = () =>
    setChecked(allChecked ? checked.filter((id) => !visibleIds.includes(id)) : [...checked, ...visibleIds]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <input
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Search deals…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          🔍
        </span>
      </div>

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
                  onClick={() =>
                    setSortField((prev) => {
                      if (prev === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                      else {
                        setSortDir("asc");
                        return key as SortField;
                      }
                      return prev;
                    })
                  }
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
                  <input type="checkbox" checked={checked.includes(d.deal_id)} onChange={() => toggleRow(d.deal_id)} />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{d.deal_id}</td>
                <td className="px-4 py-3">{d.company_name}</td>
                <td className="px-4 py-3">
                  <span className={clsx("inline-flex px-2 py-1 text-xs font-semibold rounded-full", stageColor(d.stage))}>
                    {d.stage.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">{fmtCurr(d.value)}</td>
                <td className="px-4 py-3">{d.sales_rep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-8 text-gray-500">No deals match your filters.</div>
      )}
    </div>
  );
}
