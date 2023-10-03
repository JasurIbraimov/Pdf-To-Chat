import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
    try {
        const body = await request.json();
        const { fileKey, fileName } = body;

        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
