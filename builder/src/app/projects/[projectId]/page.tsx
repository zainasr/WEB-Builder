import { ProjectView } from "@/app/ui/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
    params: Promise<{projectId: string}>
}


export default async function ProjectPage({params}: Props) {
  const {projectId} = await params;
const queryClient = getQueryClient();
void  queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({id: projectId}));
void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({projectId}));
   
  return (
  <HydrationBoundary state={dehydrate(queryClient)}>
  <Suspense fallback={<div>Loading...</div>}>
    <ProjectView projectId={projectId} />
  </Suspense>
  </HydrationBoundary> 
  );
} 