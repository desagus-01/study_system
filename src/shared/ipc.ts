export const IPC_CHANNELS = {
  getSystemStatus: "system:get-status",
  createCourse: "study-model:create-course",
  listCourses: "study-model:list-courses",
  createSource: "study-model:create-source",
  listSources: "study-model:list-sources",
  createSourceSegment: "study-model:create-source-segment",
  listSourceSegments: "study-model:list-source-segments",
  createConcept: "study-model:create-concept",
  updateConcept: "study-model:update-concept",
  listConceptVersions: "study-model:list-concept-versions",
  createRelationship: "study-model:create-relationship",
  updateRelationship: "study-model:update-relationship",
  listRelationshipVersions: "study-model:list-relationship-versions",
  createEvidenceRef: "study-model:create-evidence-ref",
  listEvidenceRefs: "study-model:list-evidence-refs"
} as const;
