import type { PiLearnApi } from "../shared/types";

declare global {
  interface Window {
    piLearn: PiLearnApi;
  }
}

export {};
