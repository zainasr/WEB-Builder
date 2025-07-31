import { createAgent, createTool, createNetwork, openai,gemini, Tool,type Message,createState} from "@inngest/agent-kit";
import { getSandbox } from "@/lib/sandbox";
import z from "zod";
import {Sandbox} from '@e2b/code-interpreter'
import { inngest } from "./client";
import { PROMPT } from "../../sandbox_templates/prompt";
import { lastMessage } from "@/agents/ai";
import prisma from "@/lib/prisma";
import { FRAGMENT_TITLE_PROMPT, RESPONSE_PROMPT } from "../../sandbox_templates/additionPrompt";


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
      const sandbox = await Sandbox.create("lov-clone",{
        timeoutMs:100000
      })
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run("get-previous-messages",async()=>{
       const Formattedmessages : Message[] = [];
      
      const messages = await prisma.message.findMany({
        where:{
          projectId:event.data.projectId
        },
        orderBy:{
          createdAt:"asc"
        }
      })
      for(const message of messages){
        Formattedmessages.push({
          type:"text",
          role:message.role === "ASSISTANT" ? "assistant" : "user",
          content:message.content   
        })
        }
        return Formattedmessages
    })

    const state = createState<CodeAgentState>({
      files:{},
      taskSummary:""
    },
     {
      
      messages:previousMessages
    }
  )

    const codeAgent = createAgent<CodeAgentState>({
      model: openai({ model: "gpt-4o", apiKey: "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" }),
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
      defaultState:state,
      router :async({network})=>{
        if(network.state.data.taskSummary){
          return
        }
        return codeAgent
      }
    })

   const result= await network.run(event.data.value, {state})

   const fragmentTitleAgent = createAgent({
    name:"fragment-title-generoter",
    system:FRAGMENT_TITLE_PROMPT,
    description:"Generate a title for the code fragment",
    model:gemini({model:"gemini-1.5-flash"}),
    tools:[],
    lifecycle:{
      onResponse:async({result})=>{
        return result
      }
    }
   })


   const ResponseAgent = createAgent({
    name:"response-agent",
    system:RESPONSE_PROMPT,
    description:"Generate a response for the code fragment",
    model:gemini({model:"gemini-1.5-flash"}),
    tools:[],
    lifecycle:{
      onResponse:async({result})=>{
        return result
      }
    }
   })

   const {output:fragmentTitle} = await fragmentTitleAgent.run(result.state.data.taskSummary)
   const {output:response} = await ResponseAgent.run(result.state.data.taskSummary)
 

  const generateFragmentTitle = ():string =>{
    if(!fragmentTitle || fragmentTitle[0].type === "text"){
      return "fragment"
    }
    else if (Array.isArray(fragmentTitle[0])){
      return fragmentTitle[0].map((item:any)=>item.text).join(" ")
    }
    else{
      return "fragment"
    }
    
  }

  const generateResponse = ():string =>{
    if(!response || response[0].type === "text"){
      return "Something went wrong"
    }
    else if (Array.isArray(response[0])){
      return response[0].map((item:any)=>item.text).join(" ")
    }
    else{
      return "Something went wrong"
    }
    
  }

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
            content:generateResponse(),
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
      title:generateFragmentTitle(),
      files:result.state.data.files,
      summary:result.state.data.taskSummary
    }
    
  }
);