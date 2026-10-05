import { contextBridge, ipcRenderer } from "electron";

import { IPC_CHANNELS } from "../shared/ipc";
import type { PiLearnApi } from "../shared/types";

const api: PiLearnApi = {
  getSystemStatus: () => ipcRenderer.invoke(IPC_CHANNELS.getSystemStatus),
  createCourse: (input) => ipcRenderer.invoke(IPC_CHANNELS.createCourse, input),
  listCourses: () => ipcRenderer.invoke(IPC_CHANNELS.listCourses),
  createSource: (input) => ipcRenderer.invoke(IPC_CHANNELS.createSource, input),
  listSources: (courseId) => ipcRenderer.invoke(IPC_CHANNELS.listSources, courseId),
  createSourceSegment: (input) => ipcRenderer.invoke(IPC_CHANNELS.createSourceSegment, input),
  listSourceSegments: (sourceId) => ipcRenderer.invoke(IPC_CHANNELS.listSourceSegments, sourceId),
  createConcept: (input) => ipcRenderer.invoke(IPC_CHANNELS.createConcept, input),
  updateConcept: (conceptId, input) =>
    ipcRenderer.invoke(IPC_CHANNELS.updateConcept, conceptId, input),
  listConceptVersions: (conceptId) =>
    ipcRenderer.invoke(IPC_CHANNELS.listConceptVersions, conceptId),
  createRelationship: (input) => ipcRenderer.invoke(IPC_CHANNELS.createRelationship, input),
  updateRelationship: (relationshipId, input) =>
    ipcRenderer.invoke(IPC_CHANNELS.updateRelationship, relationshipId, input),
  listRelationshipVersions: (relationshipId) =>
    ipcRenderer.invoke(IPC_CHANNELS.listRelationshipVersions, relationshipId),
  createEvidenceRef: (input) => ipcRenderer.invoke(IPC_CHANNELS.createEvidenceRef, input),
  listEvidenceRefs: (entityType, entityId) =>
    ipcRenderer.invoke(IPC_CHANNELS.listEvidenceRefs, entityType, entityId)
};

contextBridge.exposeInMainWorld("piLearn", api);
