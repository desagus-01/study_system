import { z } from "zod";

export const IdSchema = z.uuid();

export const CourseCreateSchema = z.object({
  title: z.string().trim().min(1).max(200)
});

export const SourceTypeSchema = z.enum(["document", "note", "web"]);

export const SourceCreateSchema = z.object({
  courseId: IdSchema,
  title: z.string().trim().min(1).max(500),
  sourceType: SourceTypeSchema
});

export const SourceSegmentCreateSchema = z.object({
  sourceId: IdSchema,
  ordinal: z.number().int().nonnegative(),
  content: z.string().trim().min(1),
  locationLabel: z.string().trim().min(1).max(500).optional()
});

export const ConceptKindSchema = z.enum([
  "concept",
  "principle",
  "procedure",
  "representation",
  "problem_family",
  "example",
  "reference_detail"
]);

export const ConceptCreateSchema = z.object({
  courseId: IdSchema,
  kind: ConceptKindSchema,
  canonicalLabel: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  userDefinition: z.string().trim().min(1).optional(),
  scope: z.string().trim().min(1).max(500).optional(),
  importance: z.number().int().min(1).max(5).optional()
});

export const ConceptUpdateSchema = ConceptCreateSchema.omit({ courseId: true, kind: true, canonicalLabel: true });

export const RelationTypeSchema = z.enum([
  "is_a",
  "part_of",
  "requires",
  "enables",
  "causes_or_influences",
  "derived_from",
  "transforms_to",
  "applies_to",
  "contrasts_with",
  "analogous_to"
]);

const RelationshipVersionSchema = z.object({
  propositionText: z.string().trim().min(1).max(2_000),
  conditions: z.record(z.string(), z.unknown()).optional(),
  importance: z.number().int().min(1).max(5).optional()
});

export const RelationshipCreateSchema = RelationshipVersionSchema.extend({
  courseId: IdSchema,
  sourceConceptId: IdSchema,
  targetConceptId: IdSchema,
  relationType: RelationTypeSchema
});

export const RelationshipUpdateSchema = RelationshipVersionSchema;

export const EvidenceEntityTypeSchema = z.enum(["concept", "relationship"]);
export const EvidenceSupportTypeSchema = z.enum([
  "supports",
  "contradicts",
  "contextualises"
]);

export const EvidenceRefCreateSchema = z.object({
  entityType: EvidenceEntityTypeSchema,
  entityId: IdSchema,
  sourceSegmentId: IdSchema,
  supportType: EvidenceSupportTypeSchema,
  verified: z.boolean().default(false)
});

export const PiStatusSchema = z.enum(["available", "not configured", "error"]);

export const SystemStatusSchema = z.object({
  electron: z.literal("ready"),
  preload: z.literal("ready"),
  sqlite: z.literal("ready"),
  pi: PiStatusSchema
});
