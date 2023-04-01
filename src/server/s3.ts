import * as Minio from "minio";
import { env } from "~/env.mjs";
import { type FileInputDataType } from "~/types";
import { dataBase64ToBuffer } from "~/utils/files";

const globalForMinio = globalThis as unknown as { s3: Minio.Client };

type PutObjectOptions = {
  keyPrefix?: string;
  keySuffix?: string;
};

export const s3Client =
  globalForMinio.s3 ||
  new Minio.Client({
    endPoint: env.S3_ENDPOINT,
    accessKey: env.S3_CLIENT_ID,
    secretKey: env.S3_CLIENT_SECRET,
    port: 443,
    useSSL: true,
  });

export const s3Helper = {
  async presignedUrl(objectName: string, expiry = 0) {
    return s3Client.presignedUrl("GET", env.S3_BUCKET, objectName, expiry);
  },
  async putObject(
    fileData: FileInputDataType,
    { keyPrefix: prefix = "", keySuffix: suffix = "" }: PutObjectOptions
  ) {
    const key = `${prefix}${fileData.name}${suffix}`;
    const buffer = dataBase64ToBuffer(fileData);

    const uploadInfo = await s3Client.putObject(env.S3_BUCKET, key, buffer);

    return { key, uploadInfo };
  },
};

if (env.NODE_ENV !== "production") globalForMinio.s3 = s3Client;
