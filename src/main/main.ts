import { app, BrowserWindow, ipcMain } from "electron";
import type Database from "better-sqlite3";
import { join } from "node:path";

import { openDatabase } from "./database";
import { getPiStatus } from "./pi-status";
import { createStudyModelHandlers } from "./study-model-ipc";
import { IPC_CHANNELS} from "../shared/ipc";
import { SystemStatusSchema } from "../shared/schemas";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

let database: Database.Database | undefined;
let mainWindow: BrowserWindow | undefined;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, "preload.cjs"),
      sandbox: true
    }
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    return;
  }

  void mainWindow.loadFile(
    join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
  );
}

app.whenReady().then(() => {
  database = openDatabase(join(app.getPath("userData"), "pi-learn.sqlite"));
  const studyModel = createStudyModelHandlers(database);

  ipcMain.handle(IPC_CHANNELS.getSystemStatus, () =>
    SystemStatusSchema.parse({
      electron: "ready",
      preload: "ready",
      sqlite: "ready",
      pi: getPiStatus()
    })
  );
  ipcMain.handle(IPC_CHANNELS.createCourse, (_event, input) => studyModel.createCourse(input));
  ipcMain.handle(IPC_CHANNELS.listCourses, () => studyModel.listCourses());
  ipcMain.handle(IPC_CHANNELS.createSource, (_event, input) => studyModel.createSource(input));
  ipcMain.handle(IPC_CHANNELS.listSources, (_event, courseId) => studyModel.listSources(courseId));
  ipcMain.handle(IPC_CHANNELS.createSourceSegment, (_event, input) => studyModel.createSourceSegment(input));
  ipcMain.handle(IPC_CHANNELS.listSourceSegments, (_event, sourceId) => studyModel.listSourceSegments(sourceId));
  ipcMain.handle(IPC_CHANNELS.createConcept, (_event, input) => studyModel.createConcept(input));
  ipcMain.handle(IPC_CHANNELS.updateConcept, (_event, conceptId, input) => studyModel.updateConcept(conceptId, input));
  ipcMain.handle(IPC_CHANNELS.listConceptVersions, (_event, conceptId) => studyModel.listConceptVersions(conceptId));
  ipcMain.handle(IPC_CHANNELS.createRelationship, (_event, input) => studyModel.createRelationship(input));
  ipcMain.handle(IPC_CHANNELS.updateRelationship, (_event, relationshipId, input) => studyModel.updateRelationship(relationshipId, input));
  ipcMain.handle(IPC_CHANNELS.listRelationshipVersions, (_event, relationshipId) => studyModel.listRelationshipVersions(relationshipId));
  ipcMain.handle(IPC_CHANNELS.createEvidenceRef, (_event, input) => studyModel.createEvidenceRef(input));
  ipcMain.handle(IPC_CHANNELS.listEvidenceRefs, (_event, entityType, entityId) => studyModel.listEvidenceRefs(entityType, entityId));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  database?.close();
});
