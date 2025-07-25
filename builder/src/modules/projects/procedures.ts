import { baseProcedure, createTRPCRouter,  } from "@/trpc/init";
import z from "zod";
import { MessageRole, MessageType, PrismaClient } from "../../generated/prisma";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const projectsRouter = createTRPCRouter({
  create: baseProcedure.input(z.object({
    content: z.string().max(1000),
    
  })
).mutation(async ({  input }) => {
    const project = await prisma.project.create({
      data: {
        name:generateSlug(2,{format:"kebab"}),
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
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return projects;
  }),

  getOne: baseProcedure.input(z.object({
    id: z.string().min(1, "Project ID is required"),
  })).query(async ({ input }) => {
    const project = await prisma.project.findUnique({
      where: { id: input.id },
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