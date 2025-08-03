import { protectedProcedure, createTRPCRouter,  } from "@/trpc/init";
import z from "zod";
import {  PrismaClient } from "../../generated/prisma";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const messagesRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    userMessage: z.string().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
    projectId: z.string(),
  })).mutation(async ({  input, ctx }) => {
   const existingProject = await prisma.project.findUnique({
    where:{
      id:input.projectId,
      userId:ctx.userId
    }
   })
   if(!existingProject){
    throw new TRPCError({
      code:"NOT_FOUND",
      message:"Project not found"
    })
   }
   
    const message = await prisma.message.create({
      data:{
        content:input.userMessage,
        role:"USER",
        type:"RESULT",
        projectId:existingProject.id
      
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
  getMany: protectedProcedure.input(z.object({
    projectId: z.string().min(1, "Project ID is required"),
  })).query(async ({ input , ctx}) => {
    const messages = await prisma.message.findMany({
      where:{
        projectId:input.projectId,
        project:{
          userId:ctx.userId
        }
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