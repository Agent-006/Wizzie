"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { useRouter, usePathname } from "next/navigation";

import { SpellValidationSchema } from "@/validations/spellSchema";
import { createSpell } from "@/lib/actions/spell/createSpell.actions";

const PostSpell = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(SpellValidationSchema),
    defaultValues: {
      spell: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof SpellValidationSchema>) => {
    await createSpell({
      text: values.spell,
      author: values.accountId,
      communityId: null,
      path: pathname,
    });

    router.push("/")
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-6"
      >
        <FormField
          control={form.control}
          name="spell"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500 text-light-2">
          Post
        </Button>
      </form>
    </Form>
  );
};

export default PostSpell;
