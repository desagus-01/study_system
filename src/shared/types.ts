import type { z } from "zod";
import type {
  ConceptCreateSchema,
  ConceptKindSchema,
  ConceptUpdateSchema,
  CourseCreateSchema,
  PiStatusSchema,
  SourceCreateSchema,
  SourceSegmentCreateSchema,
  SourceTypeSchema,
  SystemStatusSchema
} from "./schemas";

export type ConceptCreate = z.infer<typeof ConceptCreateSchema>;
export type ConceptKind = z.infer<typeof ConceptKindSchema>;
export type ConceptUpdate = z.infer<typeof ConceptUpdateSchema>;
export type CourseCreate = z.infer<typeof CourseCreateSchema>;
export type PiStatus = z.infer<typeof PiStatusSchema>;
export type SourceCreate = z.infer<typeof SourceCreateSchema>;
export type SourceSegmentCreate = z.infer<typeof SourceSegmentCreateSchema>;
export type SourceType = z.infer<typeof SourceTypeSchema>;
export type SystemStatus = z.infer<typeof SystemStatusSchema>;

export interface PiLearnApi {
  getSystemStatus(): Promise<SystemStatus>;
}
