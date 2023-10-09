"use client";

import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {};

const FileUpload = (props: Props) => {
    const [uploading, setUploading] = React.useState(false)
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({
            fileKey,
            fileName,
        }: {
            fileKey: string;
            fileName: string;
        }) => {
            const response = await axios.post("/api/create-chat", {
                fileKey,
                fileName,
            });

            return response.data
        },
    });

    const { getInputProps, getRootProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] }, // To allow users only pass pdfs
        maxFiles: 1, // only 1 file
        onDrop: async (acceptedFiles) => {
            // after user passes a pdf file
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Please upload a smaller file");
                return;
            }
            try {
                setUploading(true)
                const data = await uploadToS3(file);
                if(!data || !data?.fileKey || !data?.fileName) {
                    toast.error("Something went wrong")
                    return;
                }
                mutate(data, {
                    onSuccess: (data) => {
                        toast.success(data.message)
                        console.log(data)
                    },
                    onError: (error) => {
                        toast.error("Something went wrong!")
                    }
                })
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false)
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
                {uploading || isLoading ? <>
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin"/>
                    <p className="mt-2 text-sm text-slate-400">Loading...</p>
                </> : <>
                    <Inbox className="w-10 h-10 text-blue-500" />
                    <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
                </>} 
                
            </div>
        </div>
    );
};

export default FileUpload;
