import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowUp01Icon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  value: z.string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

interface Props {
  projectId: string;
};

export const MessageForm = ({ projectId }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const queryClient=useQueryClient()
  const trpc=useTRPC()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess:(data)=>{
      console.log(data)
      queryClient.invalidateQueries(
        trpc.messages.getMany.queryOptions({
          projectId:data.projectId
        })
      )
      form.reset()
    },
    onError:(error)=>{
      console.error(error)
      toast.error("Failed to send message")
    }
  }));
  const isPending = createMessage.isPending;
  const isDisabled = isPending || !form.formState.isValid;
  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      projectId,
      userMessage:values.value
    })

  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          form.formState.isSubmitting && "rounded-t-none",
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent"
              placeholder="Write a message..."
            />
          )}
        />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span>⌘</span>Enter
            </kbd>
            &nbsp;to submit
          </div>
          <Button type="submit" disabled={isDisabled} className="h-8">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp01Icon className="size-4" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 