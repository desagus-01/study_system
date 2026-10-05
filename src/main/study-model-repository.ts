import { randomUUID } from "node:crypto";

import type Database from "better-sqlite3";

import {
  ConceptCreateSchema,
  ConceptUpdateSchema,
  CourseCreateSchema,
  SourceCreateSchema,
  SourceSegmentCreateSchema
} from "../shared/schemas";
import type { ConceptKind, SourceType } from "../shared/types";

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
