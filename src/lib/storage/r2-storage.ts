import "server-only";

import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { serverEnv } from "@/lib/env/server";
import type { StorageObject, StorageProvider } from "./types";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${serverEnv.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = serverEnv.R2_BUCKET_NAME;

export class R2Storage implements StorageProvider {
  async putObject(key: string, content: string | File | Blob): Promise<void> {
    let body: string | Uint8Array;
    if (typeof content === "string") {
      body = content;
    } else {
      body = new Uint8Array(await content.arrayBuffer());
    }

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
      }),
    );
  }

  async getObject(key: string): Promise<string> {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return (await response.Body?.transformToString()) ?? "";
  }

  async getObjectBuffer(key: string): Promise<ArrayBuffer> {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    const bytes = await response.Body?.transformToByteArray();
    return bytes?.buffer as ArrayBuffer;
  }

  async deleteObject(key: string): Promise<void> {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }

  async deleteObjects(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    // DeleteObjectsCommand supports max 1000 keys per request
    const chunkSize = 1000;
    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunk = keys.slice(i, i + chunkSize);
      await client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: chunk.map((key) => ({ Key: key })),
          },
        }),
      );
    }
  }

  async listObjects(prefix: string): Promise<StorageObject[]> {
    const objects: StorageObject[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      if (response.Contents) {
        for (const obj of response.Contents) {
          if (obj.Key) {
            objects.push({
              key: obj.Key,
              size: obj.Size ?? 0,
              lastModified: obj.LastModified ?? new Date(),
            });
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return objects;
  }

  async copyObject(sourceKey: string, destKey: string): Promise<void> {
    await client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${sourceKey}`,
        Key: destKey,
      }),
    );
  }
}
