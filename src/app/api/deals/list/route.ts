import { NextResponse } from "next/server";
import { initializeDataSource } from "@/data-source";
import { Deal } from "@/lib/entities/deals/Deal";

export async function GET() {
  try {
    const ds = await initializeDataSource();
    const deals = await ds.getRepository(Deal).find();

    return NextResponse.json(deals);
  } catch (err) {
    console.error("Error GET /api/deals/list", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

