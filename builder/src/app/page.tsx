import { caller } from '@/trpc/server';

import {
  
  dehydrate,
  HydrationBoundary
} from '@tanstack/react-query'
import { trpc } from '@/trpc/server';
import { getQueryClient} from '@/trpc/server';
import { ClientGreeting } from './client-greeting';
export default async function Home() {
  const queryClient = getQueryClient();
  const greeting = await queryClient.fetchQuery(trpc.hello.queryOptions({ text: 'client' }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientGreeting />
    </HydrationBoundary>
  );
}