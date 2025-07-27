import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { CodeView } from "@/components/code-view/code-view";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "@/components/code-view/tree-view";

type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}
interface FileBreadCrumbProp {
    filePath:string
}

const FileBreadCrumb = ({filePath}:FileBreadCrumbProp)=>{
    const pathSegments = filePath.split("/");
    const maxSegments = 4;
    const renderBreadCrumbsItems = ()=>{
        if(pathSegments.length <=maxSegments){
            return pathSegments.map((segment,index)=>{
                const isLast = index === pathSegments.length - 1;
                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>{segment}</BreadcrumbItem>
                       {isLast?
                       
                       <BreadcrumbPage className="font-medium">{segment}</BreadcrumbPage>
                       :
                       <span className="text-muted-foreground">{segment}/</span>
                       }
                       {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                )
            })
        }
        else{
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];
            return (
                <>
                <BreadcrumbItem>{firstSegment}
                <BreadcrumbItem>
                <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="font-medium">{lastSegment}</BreadcrumbPage>
                </BreadcrumbItem>
                </>

            )
        }
    }
  return (
    <Breadcrumb>
        <BreadcrumbList>
            {renderBreadCrumbsItems()}
        </BreadcrumbList>
    </Breadcrumb>
  )
}

interface FileExplorerProps {
  files: FileCollection;
};

export const FileExplorer = ({
  files,
}: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  const [copied, setCopied] = useState(false);
  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback((
    filePath: string
  ) => {
    if (files[filePath]) {
      setSelectedFile(filePath);
    }
  }, [files]);

  const handleCopy = useCallback(() => {
    if (selectedFile && files[selectedFile]) {
        setCopied(true)
      navigator.clipboard.writeText(files[selectedFile])
       setTimeout(()=>{
        setCopied(false)
       },2000)
    }
  }, [selectedFile, files]);


 

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
               <FileBreadCrumb filePath={selectedFile} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-auto"
                      onClick={handleCopy}
                      disabled={!selectedFile || copied}
                    >
                      {copied ? <CopyCheckIcon /> : <CopyIcon />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView 
                code={files[selectedFile]} 
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view it&apos;s content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}; 