import { Suspense } from "react";
import { ProjectForm } from "@/components/project-form";

export default async function Home() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full py-10">
      <section className="w-full">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Create a New Project
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Build your next AI-powered application with our powerful tools
            </p>
          </div>
          
          <div className="mx-auto max-w-lg">
            <Suspense fallback={<div>Loading...</div>}>
              <ProjectForm />
            </Suspense>
          </div>
          {/* <ProjectList/> */}
        </div>
      </section>
    </div>
  );
}