export interface StorageProvider {
  putObject(key: string, content: string | File | Blob): Promise<void>;
  getObject(key: string): Promise<string>;
  getObjectBuffer(key: string): Promise<ArrayBuffer>;
  deleteObject(key: string): Promise<void>;
  deleteObjects(keys: string[]): Promise<void>;
  listObjects(prefix: string): Promise<StorageObject[]>;
  copyObject(sourceKey: string, destKey: string): Promise<void>;
}

export interface StorageObject {
  key: string;
  size: number;
  lastModified: Date;
}
