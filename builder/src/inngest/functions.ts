import {  SupportAgent } from "@/agents/ai";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    const result = await SupportAgent.run(
        "You are a customer support agent. You are given a question and you need to answer it.",
        event.data.question,
      );
      console.log(result);
      return { message: result.output };
  },
);