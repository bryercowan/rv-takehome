import { z } from "zod";

export const TerritorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "Territory name required"),
  states: z
    .array(
      z
        .string()
        .regex(/^[A-Z]{2}$/, "Use 2-letter state codes (e.g. CA)")
    )
    .min(1, "At least one state is required"),
});

export type Territory = z.infer<typeof TerritorySchema>;

