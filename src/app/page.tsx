import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
    const { userId } = await auth();
    const isAuth = !!userId;

    return (
        <div className="w-screen min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center text-center p-10 bg-slate-50 shadow-xl rounded-2xl">
                    <div className="flex items-center">
                        <h1 className="mr-3 text-4xl font-bold  from-gray-900 to-gray-600 bg-gradient-to-r bg-clip-text text-transparent">
                            Convert any PDF to Chat
                        </h1>

                        <UserButton afterSignOutUrl="/" />
                    </div>
                    <div className="flex mt-4">
                        {isAuth && <Button>Go to chats</Button>}
                    </div>
                    <p className="max-w-xl mt-4 text-lg text-slate-600 ">
                        Gone are the days of static PDFs; now, your documents
                        come to life as engaging, interactive chats, thanks to
                        the cutting-edge capabilities of OpenAI.
                    </p>

                    <div className="w-full mt-4">
                        {isAuth ? (
                            <h1>File Upload Component</h1>
                        ) : (
                            <Link href="/sign-in">
                                <Button>
                                    Login to get Started!
                                    <LogInIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
