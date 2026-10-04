import { contextBridge, ipcRenderer } from "electron";

import { IPC_CHANNELS } from "../shared/ipc";
import type { PiLearnApi } from "../shared/types";

const api: PiLearnApi = {
  getSystemStatus: () => ipcRenderer.invoke(IPC_CHANNELS.getSystemStatus)
};

contextBridge.exposeInMainWorld("piLearn", api);
