import type { z } from "zod";
import type {
  ConceptCreateSchema,
  ConceptKindSchema,
  ConceptUpdateSchema,
  CourseCreateSchema,
  EvidenceEntityTypeSchema,
  EvidenceRefCreateSchema,
  EvidenceSupportTypeSchema,
  PiStatusSchema,
  RelationshipCreateSchema,
  RelationshipUpdateSchema,
  RelationTypeSchema,
  SourceCreateSchema,
  SourceSegmentCreateSchema,
  SourceTypeSchema,
  SystemStatusSchema
} from "./schemas";

export type ConceptCreate = z.infer<typeof ConceptCreateSchema>;
export type ConceptKind = z.infer<typeof ConceptKindSchema>;
export type ConceptUpdate = z.infer<typeof ConceptUpdateSchema>;
export type CourseCreate = z.infer<typeof CourseCreateSchema>;
export type EvidenceEntityType = z.infer<typeof EvidenceEntityTypeSchema>;
export type EvidenceRefCreate = z.infer<typeof EvidenceRefCreateSchema>;
export type EvidenceSupportType = z.infer<typeof EvidenceSupportTypeSchema>;
export type PiStatus = z.infer<typeof PiStatusSchema>;
export type RelationshipCreate = z.infer<typeof RelationshipCreateSchema>;
export type RelationshipUpdate = z.infer<typeof RelationshipUpdateSchema>;
export type RelationType = z.infer<typeof RelationTypeSchema>;
export type SourceCreate = z.infer<typeof SourceCreateSchema>;
export type SourceSegmentCreate = z.infer<typeof SourceSegmentCreateSchema>;
export type SourceType = z.infer<typeof SourceTypeSchema>;
export type SystemStatus = z.infer<typeof SystemStatusSchema>;

export interface CourseRecord {
  id: string;
  title: string;
  createdAt: string;
}

export interface SourceRecord {
  id: string;
  courseId: string;
  title: string;
  sourceType: SourceType;
  createdAt: string;
}

export interface SourceSegmentRecord {
  id: string;
  sourceId: string;
  ordinal: number;
  content: string;
  locationLabel: string | null;
  createdAt: string;
}

export interface ConceptRecord {
  id: string;
  courseId: string;
  kind: ConceptKind;
  canonicalLabel: string;
  status: "active";
  createdBy: "user";
  currentVersionId: string;
  createdAt: string;
}

export interface ConceptVersionRecord {
  id: string;
  conceptId: string;
  title: string;
  userDefinition: string | null;
  scope: string | null;
  importance: number | null;
  supersedesId: string | null;
  createdAt: string;
}

export interface RelationshipRecord {
  id: string;
  courseId: string;
  sourceConceptId: string;
  targetConceptId: string;
  relationType: RelationType;
  status: "confirmed";
  createdBy: "user";
  currentVersionId: string;
  createdAt: string;
}

export interface RelationshipVersionRecord {
  id: string;
  relationshipId: string;
  propositionText: string;
  conditions: Record<string, unknown> | null;
  importance: number | null;
  supersedesId: string | null;
  createdAt: string;
}

export interface EvidenceRefRecord {
  id: string;
  entityType: EvidenceEntityType;
  entityId: string;
  sourceSegmentId: string;
  supportType: EvidenceSupportType;
  createdBy: "user";
  verified: boolean;
  createdAt: string;
}

export interface PiLearnApi {
  getSystemStatus(): Promise<SystemStatus>;
  createCourse(input: CourseCreate): Promise<CourseRecord>;
  listCourses(): Promise<CourseRecord[]>;
  createSource(input: SourceCreate): Promise<SourceRecord>;
  listSources(courseId: string): Promise<SourceRecord[]>;
  createSourceSegment(input: SourceSegmentCreate): Promise<SourceSegmentRecord>;
  listSourceSegments(sourceId: string): Promise<SourceSegmentRecord[]>;
  createConcept(input: ConceptCreate): Promise<ConceptRecord>;
  updateConcept(conceptId: string, input: ConceptUpdate): Promise<ConceptVersionRecord>;
  listConceptVersions(conceptId: string): Promise<ConceptVersionRecord[]>;
  createRelationship(input: RelationshipCreate): Promise<RelationshipRecord>;
  updateRelationship(
    relationshipId: string,
    input: RelationshipUpdate
  ): Promise<RelationshipVersionRecord>;
  listRelationshipVersions(relationshipId: string): Promise<RelationshipVersionRecord[]>;
  createEvidenceRef(input: EvidenceRefCreate): Promise<EvidenceRefRecord>;
  listEvidenceRefs(entityType: EvidenceEntityType, entityId: string): Promise<EvidenceRefRecord[]>;
}
