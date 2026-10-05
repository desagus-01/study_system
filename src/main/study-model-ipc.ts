import type Database from "better-sqlite3";

import { EvidenceEntityTypeSchema, IdSchema } from "../shared/schemas";
import {
  createConcept,
  createCourse,
  createEvidenceRef,
  createRelationship,
  createSource,
  createSourceSegment,
  listConceptVersions,
  listCourses,
  listEvidenceRefs,
  listRelationshipVersions,
  listSourceSegments,
  listSources,
  updateConcept,
  updateRelationship
} from "./study-model-repository";

export function createStudyModelHandlers(database: Database.Database) {
  return {
    createCourse: (input: unknown) => createCourse(database, input),
    listCourses: () => listCourses(database),
    createSource: (input: unknown) => createSource(database, input),
    listSources: (courseId: unknown) => listSources(database, IdSchema.parse(courseId)),
    createSourceSegment: (input: unknown) => createSourceSegment(database, input),
    listSourceSegments: (sourceId: unknown) =>
      listSourceSegments(database, IdSchema.parse(sourceId)),
    createConcept: (input: unknown) => createConcept(database, input),
    updateConcept: (conceptId: unknown, input: unknown) =>
      updateConcept(database, IdSchema.parse(conceptId), input),
    listConceptVersions: (conceptId: unknown) =>
      listConceptVersions(database, IdSchema.parse(conceptId)),
    createRelationship: (input: unknown) => createRelationship(database, input),
    updateRelationship: (relationshipId: unknown, input: unknown) =>
      updateRelationship(database, IdSchema.parse(relationshipId), input),
    listRelationshipVersions: (relationshipId: unknown) =>
      listRelationshipVersions(database, IdSchema.parse(relationshipId)),
    createEvidenceRef: (input: unknown) => createEvidenceRef(database, input),
    listEvidenceRefs: (entityType: unknown, entityId: unknown) =>
      listEvidenceRefs(
        database,
        EvidenceEntityTypeSchema.parse(entityType),
        IdSchema.parse(entityId)
      )
  };
}
