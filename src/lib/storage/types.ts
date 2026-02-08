export interface StorageProvider {
  /**
   * Uploads a file to the storage provider.
   * @param path The path (key) where the file should be stored.
   * @param content The content of the file.
   * @returns The public URL of the uploaded file.
   */
  upload(path: string, content: string | File | Blob): Promise<string>;

  /**
   * Deletes a file from the storage provider.
   * @param url The public URL of the file to delete.
   */
  delete(url: string): Promise<void>;
}
