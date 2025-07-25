import { createAgent, gemini, createTool, createNetwork, openai, Tool } from "@inngest/agent-kit";
import { getSandbox } from "@/lib/sandbox";
import z from "zod";
import {Sandbox} from '@e2b/code-interpreter'
import { inngest } from "./client";
import { PROMPT } from "../../sandbox_templates/prompt";
import { lastMessage } from "@/agents/ai";
import prisma from "@/lib/prisma";


interface CodeAgentState {
 
  files: {
    [key: string]: string;
  };
  taskSummary: string;
  
}


export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("lov-clone")
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent<CodeAgentState>({
      model: openai({ model: "gpt-4o", apiKey: "sk-5678efgh5678efgh5678efgh5678efgh5678efgh" }),
      name: "Code Agent",
      system: PROMPT,
      
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
            
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  }
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`,
                );
                return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async (
            { files },
            { step, network }:Tool.Options<CodeAgentState>
          ) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (e) {
                return "Error: " + e;
              }
            });
            
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          }
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                return `Error: ${e}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result,network }) => {
          const lastAssistantMessage = lastMessage(result)
          if(lastAssistantMessage && network){
            if (lastAssistantMessage.includes("<task_summary>")){
              const taskSummary = lastAssistantMessage.split("<task_summary>")[1].split("</task_summary>")[0]
              network.state.data.taskSummary = taskSummary
            }
          }
          return result
        }
      }

      
    });

    const network = createNetwork<CodeAgentState>({
      name: "coder",
      agents: [codeAgent],
      maxIter:15,
      router :async({network})=>{
        if(network.state.data.taskSummary){
          return
        }
        return codeAgent
      }
    })

   const result= await network.run(event.data.value)

   const isError = !result.state.data.taskSummary || Object.keys(result.state.data.files).length === 0

    const sandbox_url = await step.run('get-sandbox-url',async()=>{
      const sandbox = await getSandbox(sandboxId)
      const host= sandbox.getHost(3000)
      return `https://${host}`
    })


    await step.run('save_result',async()=>{
      if (isError){
        await prisma.message.create({
          data:{
            content:"Something went wrong",
            role:"ASSISTANT",
            type:"ERROR",
            projectId:event.data.projectId
          }
        })
      }
      await prisma.message.create({
        data: {
          content: result.state.data.taskSummary,
          role:"ASSISTANT",
          type:"RESULT",
          projectId:event.data.projectId,
          fragment:{
            create:{
              title:"fragment",
              files:result.state.data.files,
              SandboxUrl:sandbox_url,
              }
            }
          }
        },
      )
    })
    return {
      url : sandbox_url,
      title:"fragment",
      files:result.state.data.files,
      summary:result.state.data.taskSummary
    }
    
  }
);