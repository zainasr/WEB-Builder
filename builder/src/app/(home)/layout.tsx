import { PropsWithChildren } from "react";

interface Props{
    children: React.ReactNode;
}

export default function HomeLayout({children}: PropsWithChildren){
    return <div className="flex flex-col min-h-screen max-h-screen">
        <div className="flex flex-col pb-4 px-4">
            {children}
        </div>
    </div>
}