import { fetchUserPosts } from "@/lib/actions/user/fetchUserPosts.actions";
import { redirect } from "next/navigation";
import React from "react";
import SpellCard from "../cards/SpellCard";
import { fetchCommunityPosts } from "@/lib/actions/community/fetchCommunityPosts.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function SpellsTab({ currentUserId, accountId, accountType }: Props) {
  let result: any;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.spells.map((spell: any) => (
        <SpellCard
          key={spell._id}
          id={spell._id}
          currentUserId={currentUserId}
          parentId={spell.parentId}
          content={spell.text}
          author={
            accountType === "User"
              ? {
                  name: result.name,
                  image: result.image,
                  id: result.id,
                }
              : {
                  name: spell.author.name,
                  image: spell.author.image,
                  id: spell.author.id,
                }
          } // todo
          community={spell.community} // todo
          createdAt={spell.createdAt}
          comments={spell.children}
        />
      ))}
    </section>
  );
}

export default SpellsTab;
