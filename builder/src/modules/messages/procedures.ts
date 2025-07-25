import { baseProcedure, createTRPCRouter,  } from "@/trpc/init";
import z from "zod";
import {  PrismaClient } from "../../generated/prisma";
import { inngest } from "@/inngest/client";

const prisma = new PrismaClient();

export const messagesRouter = createTRPCRouter({
  create: baseProcedure.input(z.object({
    userMessage: z.string().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
    projectId: z.string(),
  })).mutation(async ({  input }) => {
   
    const message = await prisma.message.create({
      data:{
        content:input.userMessage,
        role:"USER",
        type:"RESULT",
        projectId:input.projectId
      }
    })

    await inngest.send({
      name: "code-agent/run",
      data: {
        value:input.userMessage,
        projectId:input.projectId
      },
    })

    return message;

  }),
  getMany: baseProcedure.input(z.object({
    projectId: z.string().min(1, "Project ID is required"),
  })).query(async ({ input }) => {
    const messages = await prisma.message.findMany({
      where:{
        projectId:input.projectId
      },
      include:{
        fragment:true
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  }),

})