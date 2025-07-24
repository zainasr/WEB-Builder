import { baseProcedure, createTRPCRouter,  } from "@/trpc/init";
import z from "zod";
import { MessageRole, MessageType, PrismaClient } from "../../generated/prisma";
import { inngest } from "@/inngest/client";

const prisma = new PrismaClient();

export const messagesRouter = createTRPCRouter({
  create: baseProcedure.input(z.object({
    content: z.string(),
  })).mutation(async ({  input }) => {
    const message = await prisma.message.create({
      data: {
        content: input.content,
        role:"USER",
        type:"RESULT"
      },
    })

    await inngest.send({
      name: "code-agent/run",
      data: {
        value:input.content
      },
    })

    return message;
  }),
  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return messages;
  }),

})