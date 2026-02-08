import "server-only";
import { del, put } from "@vercel/blob";
import { serverEnv } from "@/lib/env/server";
import type { StorageProvider } from "./types";

export class VercelBlobStorage implements StorageProvider {
  async upload(path: string, content: string | File | Blob): Promise<string> {
    const blob = await put(path, content, {
      access: "public",
      token: serverEnv.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  async delete(url: string): Promise<void> {
    await del(url, {
      token: serverEnv.BLOB_READ_WRITE_TOKEN,
    });
  }
}
