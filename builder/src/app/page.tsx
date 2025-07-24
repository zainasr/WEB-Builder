

import {
  dehydrate,
  HydrationBoundary
} from '@tanstack/react-query'
import { getQueryClient} from '@/trpc/server';
import { ClientGreeting } from './client-greeting';
export default async function Home() {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientGreeting />
    </HydrationBoundary>
  );
}