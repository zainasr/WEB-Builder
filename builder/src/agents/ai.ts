import { createAgent,gemini } from "@inngest/agent-kit";

export const SupportAgent = createAgent({
  model: gemini({ model: "gemini-1.5-flash" }),
  name: "Customer support specialist",
  system: "You are an customer support specialist..."
});