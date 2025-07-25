'use client';
import { useTRPC } from '@/trpc/client';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

export function ClientGreeting() {
  const trpc = useTRPC();
  const { mutate } = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: (data) => {
      console.log(data);
    },
  }));
  return (
    <>
      <input type="text" />
    </>
  );
}