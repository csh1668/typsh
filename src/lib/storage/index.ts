import "server-only";
import { R2Storage } from "./r2-storage";
import type { StorageProvider } from "./types";

export const storage: StorageProvider = new R2Storage();

export type { StorageProvider };
