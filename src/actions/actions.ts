"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION1!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY1!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1!,
  },
});

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};

const allowedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const maxFileSize = 1048576 * 10; // 1 MB

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export async function getSignedURL({
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams) {
  // first just make sure in our code that we're only allowing the file types we want
  if (!allowedFileTypes.includes(fileType)) {
    return { failure: "File type not allowed" };
  }

  if (fileSize > maxFileSize) {
    return { failure: "File size too large" };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME1!,
    Key: generateFileName(),
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 60 } // 60 seconds
  );

  return { success: { url } };
}
