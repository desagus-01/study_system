import { z } from "zod";

export const PiStatusSchema = z.enum(["available", "not configured", "error"]);

export const SystemStatusSchema = z.object({
  electron: z.literal("ready"),
  preload: z.literal("ready"),
  sqlite: z.literal("ready"),
  pi: PiStatusSchema
});
