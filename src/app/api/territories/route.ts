import { NextResponse } from "next/server";
import { initializeDataSource } from "@/data-source";
import { getTerritoryStats } from "@/lib/services/territory.service";

export async function GET() {
  await initializeDataSource();
  const stats = await getTerritoryStats();
  return NextResponse.json(stats);
}

