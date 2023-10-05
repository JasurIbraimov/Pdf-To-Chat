import AWS from "aws-sdk"
import fs from "fs"

export async function downloadFromS3(fileKey: string) {
  try {
    // Initialize S3 bucket
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3({
      params: {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_S3_BUCKET_REGION,
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: fileKey
    };
    
    // Get object from S3 bucket
    const obj = await s3.getObject(params).promise()
    
    // Download to our folder
    const fileName = `/tmp/pdf-${Date.now()}.pdf`
    fs.writeFileSync(fileName, obj.Body as Buffer)
    
    return fileName;
  } catch (error) {
    throw error
  }
}