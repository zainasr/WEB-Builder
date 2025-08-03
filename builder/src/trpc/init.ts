import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';
import { auth } from '@clerk/nextjs/server';
export const createTRPCContext = cache(async () => {
  return { auth : await auth()};
});
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

const isAuthed = t.middleware(async ({ctx, next})=>{
  const {userId} = await ctx.auth;
  if(!userId) throw new TRPCError({code: 'UNAUTHORIZED'});
  return next({ctx: {userId, auth: ctx.auth}});
})




export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);