import "server-only";
import type { StorageProvider } from "./types";
import { VercelBlobStorage } from "./vercel-blob-storage";

export const storage: StorageProvider = new VercelBlobStorage();

export type { StorageProvider };
