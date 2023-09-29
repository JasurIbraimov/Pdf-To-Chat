import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
    try {
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
        const fileKey =
            "uploads/" + Date.now().toString() + file.name.replaceAll(" ", "");
        console.log(fileKey)
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: fileKey,
            Body: file,
            ContentType: "application/pdf"
        };
        console.log(params)
        const upload = s3
            .putObject(params)
            .on("httpUploadProgress", (event) => {
                console.log(
                    "Uploading to s3",
                    parseInt(((event.loaded * 100) / event.total).toString()) +
                        "%"
                );
            })
            .promise();

        await upload.then((data) => {
            console.log("successfully uploaded to S3!", fileKey);
        });

        return Promise.resolve({
            fileKey,
            fileName: file.name,
        });
    } catch (error) {
        return Promise.reject(error)
    }
}

export function getS3Url(fileKey: string) {
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_BUCKET_REGION}.amazonaws.com/${fileKey}`;
}
