import { z } from "zod";

export const FileInputData = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  mime: z.string().nullish(),
  body: z.string(),
});

export type FileInputDataType = z.infer<typeof FileInputData>;
