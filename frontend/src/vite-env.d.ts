/// <reference types="vite/client" />

import type { Ketcher } from "ketcher-core";

declare global {
  interface Window {
    global: Window;
    ketcher: Ketcher;
    process: {
      env: {
        NODE_ENV: string;
        [key: string]: string;
      };
    };
  }
}
