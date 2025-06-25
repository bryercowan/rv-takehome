import { AppDataSource } from "@/data-source";
import { Deal } from "@/lib/entities/deals/Deal";

export async function getTerritoryStats() {
  const repo = AppDataSource.getRepository(Deal);

  const rows = await repo.query(`
    SELECT
      territory,
      SUM(CASE WHEN stage NOT IN ('closed_won','closed_lost') THEN value ELSE 0 END) AS openValue,
      SUM(CASE WHEN stage = 'closed_won'                       THEN value ELSE 0 END) AS wonValue,
      COUNT(*)                                                AS dealCount
    FROM deal
    GROUP BY territory
  `);

  return rows.map((r: any) => ({
    territory: r.territory,
    openValue: Number(r.openValue),
    wonValue: Number(r.wonValue),
    dealCount: Number(r.dealCount),
  }));
}
