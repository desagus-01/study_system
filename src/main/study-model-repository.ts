import { randomUUID } from "node:crypto";

import type Database from "better-sqlite3";

import {
  ConceptCreateSchema,
  ConceptUpdateSchema,
  CourseCreateSchema,
  EvidenceRefCreateSchema,
  RelationshipCreateSchema,
  RelationshipUpdateSchema,
  SourceCreateSchema,
  SourceSegmentCreateSchema
} from "../shared/schemas";
import type {
  ConceptKind,
  EvidenceEntityType,
  EvidenceSupportType,
  RelationType,
  SourceType
} from "../shared/types";

export interface Course {
  id: string;
  title: string;
  createdAt: string;
}

export interface Concept {
  id: string;
  courseId: string;
  kind: ConceptKind;
  canonicalLabel: string;
  status: "active";
  createdBy: "user";
  currentVersionId: string;
  createdAt: string;
}

export interface ConceptVersion {
  id: string;
  conceptId: string;
  title: string;
  userDefinition: string | null;
  scope: string | null;
  importance: number | null;
  supersedesId: string | null;
  createdAt: string;
}

export interface EvidenceRef {
  id: string;
  entityType: EvidenceEntityType;
  entityId: string;
  sourceSegmentId: string;
  supportType: EvidenceSupportType;
  createdBy: "user";
  verified: boolean;
  createdAt: string;
}

export interface Relationship {
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

export interface RelationshipVersion {
  id: string;
  relationshipId: string;
  propositionText: string;
  conditions: Record<string, unknown> | null;
  importance: number | null;
  supersedesId: string | null;
  createdAt: string;
}

export interface Source {
  id: string;
  courseId: string;
  title: string;
  sourceType: SourceType;
  createdAt: string;
}

export interface SourceSegment {
  id: string;
  sourceId: string;
  ordinal: number;
  content: string;
  locationLabel: string | null;
  createdAt: string;
}

export function createCourse(database: Database.Database, input: unknown): Course {
  const values = CourseCreateSchema.parse(input);
  const course: Course = {
    id: randomUUID(),
    title: values.title,
    createdAt: new Date().toISOString()
  };

  database
    .prepare("INSERT INTO courses (id, title, created_at) VALUES (?, ?, ?)")
    .run(course.id, course.title, course.createdAt);

  return course;
}

export function listCourses(database: Database.Database): Course[] {
  return database
    .prepare("SELECT id, title, created_at AS createdAt FROM courses ORDER BY created_at, id")
    .all() as Course[];
}

export function createConcept(database: Database.Database, input: unknown): Concept {
  const values = ConceptCreateSchema.parse(input);
  const conceptId = randomUUID();
  const versionId = randomUUID();
  const createdAt = new Date().toISOString();
  const concept: Concept = {
    id: conceptId,
    courseId: values.courseId,
    kind: values.kind,
    canonicalLabel: values.canonicalLabel,
    status: "active",
    createdBy: "user",
    currentVersionId: versionId,
    createdAt
  };

  database.transaction(() => {
    database
      .prepare(
        "INSERT INTO concepts (id, course_id, kind, canonical_label, status, created_by, current_version_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NULL, ?)"
      )
      .run(
        concept.id,
        concept.courseId,
        concept.kind,
        concept.canonicalLabel,
        concept.status,
        concept.createdBy,
        concept.createdAt
      );
    insertConceptVersion(database, versionId, concept.id, values, null, createdAt);
    database
      .prepare("UPDATE concepts SET current_version_id = ? WHERE id = ?")
      .run(versionId, concept.id);
  })();

  return concept;
}

export function updateConcept(
  database: Database.Database,
  conceptId: string,
  input: unknown
): ConceptVersion {
  const values = ConceptUpdateSchema.parse(input);
  const currentConcept = database
    .prepare("SELECT current_version_id AS currentVersionId FROM concepts WHERE id = ?")
    .get(conceptId) as { currentVersionId: string } | undefined;

  if (!currentConcept) {
    throw new Error("Concept not found.");
  }

  const versionId = randomUUID();
  const createdAt = new Date().toISOString();
  const version = createConceptVersion(versionId, conceptId, values, currentConcept.currentVersionId, createdAt);

  database.transaction(() => {
    insertConceptVersion(database, version.id, conceptId, values, version.supersedesId, createdAt);
    database
      .prepare("UPDATE concepts SET current_version_id = ? WHERE id = ?")
      .run(version.id, conceptId);
  })();

  return version;
}

export function listConceptVersions(
  database: Database.Database,
  conceptId: string
): ConceptVersion[] {
  return database
    .prepare(
      "SELECT id, concept_id AS conceptId, title, user_definition AS userDefinition, scope, importance, supersedes_id AS supersedesId, created_at AS createdAt FROM concept_versions WHERE concept_id = ? ORDER BY created_at, id"
    )
    .all(conceptId) as ConceptVersion[];
}

export function createEvidenceRef(database: Database.Database, input: unknown): EvidenceRef {
  const values = EvidenceRefCreateSchema.parse(input);
  assertEvidenceRefTargetsAreValid(database, values.entityType, values.entityId, values.sourceSegmentId);
  const evidenceRef: EvidenceRef = {
    id: randomUUID(),
    entityType: values.entityType,
    entityId: values.entityId,
    sourceSegmentId: values.sourceSegmentId,
    supportType: values.supportType,
    createdBy: "user",
    verified: values.verified,
    createdAt: new Date().toISOString()
  };

  database
    .prepare(
      "INSERT INTO evidence_refs (id, entity_type, entity_id, source_segment_id, support_type, created_by, verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      evidenceRef.id,
      evidenceRef.entityType,
      evidenceRef.entityId,
      evidenceRef.sourceSegmentId,
      evidenceRef.supportType,
      evidenceRef.createdBy,
      Number(evidenceRef.verified),
      evidenceRef.createdAt
    );

  return evidenceRef;
}

export function listEvidenceRefs(
  database: Database.Database,
  entityType: EvidenceEntityType,
  entityId: string
): EvidenceRef[] {
  return (database
    .prepare(
      "SELECT id, entity_type AS entityType, entity_id AS entityId, source_segment_id AS sourceSegmentId, support_type AS supportType, created_by AS createdBy, verified, created_at AS createdAt FROM evidence_refs WHERE entity_type = ? AND entity_id = ? ORDER BY created_at, id"
    )
    .all(entityType, entityId) as Array<Omit<EvidenceRef, "verified"> & { verified: number }>)
    .map((evidenceRef) => ({ ...evidenceRef, verified: evidenceRef.verified === 1 }));
}

export function createRelationship(
  database: Database.Database,
  input: unknown
): Relationship {
  const values = RelationshipCreateSchema.parse(input);
  assertRelationshipConceptsBelongToCourse(database, values.courseId, values.sourceConceptId, values.targetConceptId);
  const relationshipId = randomUUID();
  const versionId = randomUUID();
  const createdAt = new Date().toISOString();
  const relationship: Relationship = {
    id: relationshipId,
    courseId: values.courseId,
    sourceConceptId: values.sourceConceptId,
    targetConceptId: values.targetConceptId,
    relationType: values.relationType,
    status: "confirmed",
    createdBy: "user",
    currentVersionId: versionId,
    createdAt
  };

  database.transaction(() => {
    database
      .prepare(
        "INSERT INTO relationships (id, course_id, source_concept_id, target_concept_id, relation_type, status, created_by, current_version_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?)"
      )
      .run(
        relationship.id,
        relationship.courseId,
        relationship.sourceConceptId,
        relationship.targetConceptId,
        relationship.relationType,
        relationship.status,
        relationship.createdBy,
        relationship.createdAt
      );
    insertRelationshipVersion(database, versionId, relationship.id, values, null, createdAt);
    database
      .prepare("UPDATE relationships SET current_version_id = ? WHERE id = ?")
      .run(versionId, relationship.id);
  })();

  return relationship;
}

export function updateRelationship(
  database: Database.Database,
  relationshipId: string,
  input: unknown
): RelationshipVersion {
  const values = RelationshipUpdateSchema.parse(input);
  const relationship = database
    .prepare("SELECT current_version_id AS currentVersionId FROM relationships WHERE id = ?")
    .get(relationshipId) as { currentVersionId: string } | undefined;

  if (!relationship) {
    throw new Error("Relationship not found.");
  }

  const version = createRelationshipVersion(
    randomUUID(),
    relationshipId,
    values,
    relationship.currentVersionId,
    new Date().toISOString()
  );
  database.transaction(() => {
    insertRelationshipVersion(database, version.id, relationshipId, values, version.supersedesId, version.createdAt);
    database
      .prepare("UPDATE relationships SET current_version_id = ? WHERE id = ?")
      .run(version.id, relationshipId);
  })();

  return version;
}

export function listRelationshipVersions(
  database: Database.Database,
  relationshipId: string
): RelationshipVersion[] {
  return (database
    .prepare(
      "SELECT id, relationship_id AS relationshipId, proposition_text AS propositionText, conditions_json AS conditionsJson, importance, supersedes_id AS supersedesId, created_at AS createdAt FROM relationship_versions WHERE relationship_id = ? ORDER BY created_at, id"
    )
    .all(relationshipId) as Array<Omit<RelationshipVersion, "conditions"> & { conditionsJson: string | null }>)
    .map(({ conditionsJson, ...version }) => ({
      ...version,
      conditions: conditionsJson ? (JSON.parse(conditionsJson) as Record<string, unknown>) : null
    }));
}

export function createSource(database: Database.Database, input: unknown): Source {
  const values = SourceCreateSchema.parse(input);
  const source: Source = {
    id: randomUUID(),
    courseId: values.courseId,
    title: values.title,
    sourceType: values.sourceType,
    createdAt: new Date().toISOString()
  };

  database
    .prepare(
      "INSERT INTO sources (id, course_id, title, source_type, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .run(source.id, source.courseId, source.title, source.sourceType, source.createdAt);

  return source;
}

function createConceptVersion(
  id: string,
  conceptId: string,
  values: { title: string; userDefinition?: string; scope?: string; importance?: number },
  supersedesId: string | null,
  createdAt: string
): ConceptVersion {
  return {
    id,
    conceptId,
    title: values.title,
    userDefinition: values.userDefinition ?? null,
    scope: values.scope ?? null,
    importance: values.importance ?? null,
    supersedesId,
    createdAt
  };
}

function insertConceptVersion(
  database: Database.Database,
  id: string,
  conceptId: string,
  values: { title: string; userDefinition?: string; scope?: string; importance?: number },
  supersedesId: string | null,
  createdAt: string
): void {
  const version = createConceptVersion(id, conceptId, values, supersedesId, createdAt);
  database
    .prepare(
      "INSERT INTO concept_versions (id, concept_id, title, user_definition, scope, importance, supersedes_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      version.id,
      version.conceptId,
      version.title,
      version.userDefinition,
      version.scope,
      version.importance,
      version.supersedesId,
      version.createdAt
    );
}

function createRelationshipVersion(
  id: string,
  relationshipId: string,
  values: { propositionText: string; conditions?: Record<string, unknown>; importance?: number },
  supersedesId: string | null,
  createdAt: string
): RelationshipVersion {
  return {
    id,
    relationshipId,
    propositionText: values.propositionText,
    conditions: values.conditions ?? null,
    importance: values.importance ?? null,
    supersedesId,
    createdAt
  };
}

function insertRelationshipVersion(
  database: Database.Database,
  id: string,
  relationshipId: string,
  values: { propositionText: string; conditions?: Record<string, unknown>; importance?: number },
  supersedesId: string | null,
  createdAt: string
): void {
  const version = createRelationshipVersion(id, relationshipId, values, supersedesId, createdAt);
  database
    .prepare(
      "INSERT INTO relationship_versions (id, relationship_id, proposition_text, conditions_json, importance, supersedes_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      version.id,
      version.relationshipId,
      version.propositionText,
      version.conditions ? JSON.stringify(version.conditions) : null,
      version.importance,
      version.supersedesId,
      version.createdAt
    );
}

function assertEvidenceRefTargetsAreValid(
  database: Database.Database,
  entityType: EvidenceEntityType,
  entityId: string,
  sourceSegmentId: string
): void {
  const entityTable = entityType === "concept" ? "concepts" : "relationships";
  const entity = database
    .prepare(`SELECT course_id AS courseId FROM ${entityTable} WHERE id = ?`)
    .get(entityId) as { courseId: string } | undefined;
  const sourceSegment = database
    .prepare(
      "SELECT sources.course_id AS courseId FROM source_segments JOIN sources ON sources.id = source_segments.source_id WHERE source_segments.id = ?"
    )
    .get(sourceSegmentId) as { courseId: string } | undefined;

  if (!entity || !sourceSegment || entity.courseId !== sourceSegment.courseId) {
    throw new Error("Evidence must connect an entity and source segment from the same course.");
  }
}

function assertRelationshipConceptsBelongToCourse(
  database: Database.Database,
  courseId: string,
  sourceConceptId: string,
  targetConceptId: string
): void {
  const concept = database.prepare("SELECT course_id AS courseId FROM concepts WHERE id = ?");
  const sourceConcept = concept.get(sourceConceptId) as { courseId: string } | undefined;
  const targetConcept = concept.get(targetConceptId) as { courseId: string } | undefined;

  if (sourceConcept?.courseId !== courseId || targetConcept?.courseId !== courseId) {
    throw new Error("Relationship concepts must belong to its course.");
  }
}

export function listSources(database: Database.Database, courseId: string): Source[] {
  return database
    .prepare(
      "SELECT id, course_id AS courseId, title, source_type AS sourceType, created_at AS createdAt FROM sources WHERE course_id = ? ORDER BY created_at, id"
    )
    .all(courseId) as Source[];
}

export function createSourceSegment(
  database: Database.Database,
  input: unknown
): SourceSegment {
  const values = SourceSegmentCreateSchema.parse(input);
  const sourceSegment: SourceSegment = {
    id: randomUUID(),
    sourceId: values.sourceId,
    ordinal: values.ordinal,
    content: values.content,
    locationLabel: values.locationLabel ?? null,
    createdAt: new Date().toISOString()
  };

  database
    .prepare(
      "INSERT INTO source_segments (id, source_id, ordinal, content, location_label, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(
      sourceSegment.id,
      sourceSegment.sourceId,
      sourceSegment.ordinal,
      sourceSegment.content,
      sourceSegment.locationLabel,
      sourceSegment.createdAt
    );

  return sourceSegment;
}

export function listSourceSegments(
  database: Database.Database,
  sourceId: string
): SourceSegment[] {
  return database
    .prepare(
      "SELECT id, source_id AS sourceId, ordinal, content, location_label AS locationLabel, created_at AS createdAt FROM source_segments WHERE source_id = ? ORDER BY ordinal"
    )
    .all(sourceId) as SourceSegment[];
}
