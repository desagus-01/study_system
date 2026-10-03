import type { z } from "zod";
import type { PiStatusSchema, SystemStatusSchema } from "./schemas";

export type PiStatus = z.infer<typeof PiStatusSchema>;
export type SystemStatus = z.infer<typeof SystemStatusSchema>;

export interface PiLearnApi {
  getSystemStatus(): Promise<SystemStatus>;
}
