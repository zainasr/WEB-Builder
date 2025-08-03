import { protectedProcedure, createTRPCRouter,  } from "@/trpc/init";
import z from "zod";
import { MessageRole, MessageType, PrismaClient } from "../../generated/prisma";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    content: z.string().max(1000),
    
  })
).mutation(async ({  input, ctx }) => {
    const project = await prisma.project.create({
      data: {
        name:generateSlug(2,{format:"kebab"}),
        userId:ctx.userId,
        messages:{
          create:{
            content:input.content,
            role:"USER",
            type:"RESULT"
          }
        }
      },

    })

    await inngest.send({
      name: "code-agent/run",
      data: {
        value:input.content,
        projectId:project.id
      },
    })

    return project;
  }),
  getMany: protectedProcedure.query(async ({ctx}) => {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where:{
        userId:ctx.userId
      }
    });
    return projects;
  }),

  getOne: protectedProcedure.input(z.object({
    id: z.string().min(1, "Project ID is required"),
  })).query(async ({ input, ctx }) => {
    const project = await prisma.project.findUnique({
      where: { id: input.id, userId: ctx.userId },
    });

    if(!project){
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }
    return project;
  }),


})