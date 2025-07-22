import {  codeAgent, SupportAgent } from "@/agents/ai";
import {Sandbox} from '@e2b/code-interpreter'
import { inngest } from "./client";
import { getSandbox } from "@/lib/sandbox";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("lov-clone")
      return sandbox.sandboxId;
    });

    const {output}= await codeAgent.run(
      'hello'
    )

    const sandbox_url = await step.run('get-sandbox-url',async()=>{
      const sandbox = await getSandbox(sandboxId)
      const host= sandbox.getHost(3000)
      return `https://${host}`

    })

    return {output,sandbox_url}
    
  }
);