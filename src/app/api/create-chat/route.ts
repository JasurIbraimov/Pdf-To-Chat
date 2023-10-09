import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
    try {
        const body = await request.json();
        const { fileKey, fileName } = body;
        const pages = await loadS3IntoPinecone(fileKey)
        return NextResponse.json({ pages }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
