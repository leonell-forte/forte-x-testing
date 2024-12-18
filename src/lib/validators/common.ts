import { z } from "zod";

export const fileSchema = z.object({
  id: z.number().min(1),

  key: z.string(),

  filename: z.string(),

  fileUrl: z.string(),
});
