import AWS from "aws-sdk";
import fs from "fs";

export async function downloadFromS3(fileKey: string) {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize S3 bucket
      const s3 = new AWS.S3({
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
        region: process.env.NEXT_PUBLIC_S3_BUCKET_REGION,
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: fileKey,
      };

      // Get object from S3 bucket
      const obj = await s3.getObject(params).promise();

      // Download to our folder
      const fileName = `/tmp/pdf-${Date.now().toString()}.pdf`;
      if (obj.Body instanceof require("stream").Readable) {
        const file = fs.createWriteStream(fileName);
        file.on("open", (fd) => {
          // @ts-ignore
          obj.Body?.pipe(fd).on("finish", () => {
            return resolve(fileName);
          });
        });
      }
    } catch (error) {
      console.error(error);
      return reject(error);
    }
  });
}
