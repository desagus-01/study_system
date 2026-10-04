import { app, BrowserWindow, ipcMain } from "electron";
import type Database from "better-sqlite3";
import { join } from "node:path";

import { openDatabase } from "./database";
import { getPiStatus } from "./pi-status";
import { IPC_CHANNELS } from "../shared/ipc";
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

  ipcMain.handle(IPC_CHANNELS.getSystemStatus, () =>
    SystemStatusSchema.parse({
      electron: "ready",
      preload: "ready",
      sqlite: "ready",
      pi: getPiStatus()
    })
  );

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
