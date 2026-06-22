import { Client } from 'minio';

// Pattern Singleton che garantisce un'unica connessione a MinIO
class MinioStorage {
  private static instance: Client;
  static readonly BUCKET = process.env.MINIO_BUCKET || 'compliance';

  static getInstance(): Client {
    if (!MinioStorage.instance) {
      MinioStorage.instance = new Client({
        endPoint:  process.env.MINIO_ENDPOINT  || 'minio',
        port:      Number(process.env.MINIO_PORT) || 9000,
        useSSL:    false,
        accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
      });
    }
    return MinioStorage.instance;
  }

  // Crea il "bucket", ovvero delle cartelle in cui si salvano i PDF. 
  static async ensureBucket(): Promise<void> {
    const client = MinioStorage.getInstance();
    const exists = await client.bucketExists(MinioStorage.BUCKET);
    if (!exists) {
      await client.makeBucket(MinioStorage.BUCKET);
    }
  }
}

export default MinioStorage;
