import { z } from "zod";

export const AssignmentSchema = z.object({
  id: z.number().int().positive().optional(),
  dealId: z.string(),
  oldRep: z.string(),
  newRep: z.string(),
  changedAt: z
    .string()
    .optional()
    .refine((d) => !d || !isNaN(Date.parse(d)), {
      message: "Invalid ISO date",
    }),
});

export type Assignment = z.infer<typeof AssignmentSchema>;

