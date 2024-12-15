import { z } from "zod";

export const fileSchema = z.object({
  id: z.number(),

  key: z.string(),

  filename: z.string(),

  fileUrl: z.string(),
});
