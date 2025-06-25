"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TerritoryMap from "@/components/TerritoryMap";
import AssignDialog from "@/components/AssignDialog";
import TerritoryTable from "@/components/TerritoryTable";
import TerritoryInsights from "@/components/TerritoryInsights";
import clsx from "clsx";

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-5xl">
        {children}
      </main>
    </div>
  );
}



export default function TerritoriesPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["territories"],
    queryFn: () => fetch("/api/territories").then((r) => r.json()),
    staleTime: 60_000,
  });

  const { data: deals = [] } = useQuery({
    queryKey: ["deals"],
    queryFn: () => fetch("/api/deals/list").then((r) => r.json()),
  });

  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [stageFilter, setStageFilter] = useState<string | null>(null);

  return (
    <PageFrame>
      <h1 className="text-2xl font-semibold">Territory Dashboard</h1>

      <section className="rounded-lg border p-2 bg-white shadow-sm w-full">
        {isLoading ? (
          <p className="text-center py-24">Loading map…</p>
        ) : (
          <TerritoryMap
            stats={data}
            selected={selected}
            onSelect={(t) => setSelected(t === selected ? null : t)}
          />
        )}
      </section>

      <section className="w-full">
        {!isLoading && <TerritoryInsights territoryStats={data} deals={deals} selected={selected} />}
      </section>

      <section className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Deal List</h2>
          <button
            className="rounded bg-indigo-600 text-white px-4 py-1.5 disabled:opacity-30"
            disabled={!checkedIds.length}
            onClick={() => setDialogOpen(true)}
          >
            Reassign&nbsp;({checkedIds.length})
          </button>
        </div>

        <TerritoryTable
          territoryFilter={selected}
          onCheckChange={setCheckedIds}
        />
      </section>

      <AssignDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        dealIds={checkedIds}
        onComplete={() => {
          setCheckedIds([]);
          setDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["deals"] });
          queryClient.invalidateQueries({ queryKey: ["territories"] });
        }}
      />
    </PageFrame>
  );
}
