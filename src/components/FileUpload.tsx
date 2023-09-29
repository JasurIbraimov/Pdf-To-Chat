"use client";

import { uploadToS3 } from "@/lib/s3";
import { Inbox } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
type Props = {};

const FileUpload = (props: Props) => {
    const { getInputProps, getRootProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] }, // To allow users only pass pdfs
        maxFiles: 1, // only 1 file
        onDrop: async (acceptedFiles) => {
            // after user passes a pdf file
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                console.error("Please upload smaller file");
                return;
            }
            try {
                const data = await uploadToS3(file);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        },
    });
    return (
        <div className="p-2 bg-white rounded-xl">
            <div
                {...getRootProps({
                    className:
                        "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
                })}
            >
                <input {...getInputProps()} />

                <>
                    <Inbox className="w-10 h-10 text-blue-500" />
                    <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
                </>
            </div>
        </div>
    );
};

export default FileUpload;
