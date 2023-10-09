import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENV!,
  });
};

export async function loadS3IntoPinecone(fileKey: string) {
  //1. Obtain the PDF -> download and read from pdf
  console.log("Downloading s3 into file system");
  const fileName = await downloadFromS3(fileKey);
  if (!fileName) {
    throw new Error("Could not download from S3");
  }
  const loader = new PDFLoader(fileName as string);
  const pages = await loader.load();
  return pages;
}
