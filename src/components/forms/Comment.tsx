"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { CommentValidationSchema } from "@/validations/commentSchema";
import { Input } from "../ui/input";
import Image from "next/image";
import { addCommentToSpell } from "@/lib/actions/spell/addCommentToSpell";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  spellId: string;
  currentUserImg: string;
  currentUserId: string;
}

function Comment({ spellId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidationSchema),
    defaultValues: {
      spell: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidationSchema>) => {
    await addCommentToSpell(
      spellId,
      values.spell,
      JSON.parse(currentUserId),
      pathname,
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="spell"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none bg-dark-3"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
