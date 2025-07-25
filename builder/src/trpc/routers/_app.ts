
import {  createTRPCRouter } from '../init';
import { messagesRouter } from '@/modules/messages/procedures';
import { projectsRouter } from '@/modules/projects/procedures';
export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;