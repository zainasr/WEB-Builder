'use client'
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "./ProjectHeader";
import { FragmentWeb } from "./FragmentWeb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, CodeIcon, CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "./file-explorer";
import { MessagesContainer } from "./messages-container";
import { ErrorBoundary } from "react-error-boundary";
import { UserButton } from "@clerk/nextjs";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
 
  
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary fallbackRender={({error})=>{
            return <div>Error: {error.message}</div>
          }}>
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallbackRender={({error})=>{
            return <div>Error: {error.message}</div>
          }}>
         <Suspense fallback={<div>Messages Container Error</div>}>
          <MessagesContainer projectId={projectId}
           activeFragment={activeFragment}
           setActiveFragment={setActiveFragment}
          />
         </Suspense>
         </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel
          defaultSize={65}
          minSize={25}
          className="flex flex-col min-h-0"
        >
          <Tabs value={tabState} onValueChange={(value) => setTabState(value as "preview" | "code")} className="flex flex-col h-full">
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size="sm" variant="default">
                  <Link href="/pricing">
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
                <UserButton/>
              </div>
            </div>
            <TabsContent value="preview" className="flex-1 overflow-hidden">
              {!!activeFragment && <FragmentWeb fragment={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="flex-1 overflow-hidden">
              {
                !!activeFragment?.files && (
                  <div className="h-full">
                    <FileExplorer files={activeFragment.files as {[path:string]:string}} />
                  </div>
                )
              }
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}; 