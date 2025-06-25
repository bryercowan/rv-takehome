import { z } from "zod";
import { NextResponse } from "next/server";
import { AppDataSource, initializeDataSource } from "@/data-source";
import { Deal } from "@/lib/entities/deals/Deal";
import { Assignment } from "@/lib/entities/assignment/Assignment";
import { EntityManager } from "typeorm";

const BodySchema = z.object({
  dealIds: z.array(z.string()),
  newRep: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json(parsed.error, { status: 400 });

  const { dealIds, newRep } = parsed.data;
  await initializeDataSource();
  const dealRepo = AppDataSource.getRepository(Deal);
  const auditRepo = AppDataSource.getRepository(Assignment);

  await dealRepo.manager.transaction(async (trx: EntityManager) => {
    for (const id of dealIds) {
      const deal = await trx.findOne(Deal, { where: { deal_id: id } });
      if (!deal) continue;

      await trx.save(Assignment, {
        dealId: id,
        oldRep: deal.sales_rep,
        newRep,
      });

      deal.sales_rep = newRep;
      await trx.save(deal);

      //ws later maybe
      // globalThis.__WS__?.broadcast({ type: "deal.updated", payload: { id, newRep } });
    }
  });

  return NextResponse.json({ reassigned: dealIds.length });
}

