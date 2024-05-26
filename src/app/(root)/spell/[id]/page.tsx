import SpellCard from "@/components/cards/SpellCard";
import Comment from "@/components/forms/Comment";
import { fetchSpellById } from "@/lib/actions/spell/fetchSpellById.actions";
import { fetchUser } from "@/lib/actions/user/fetchUser.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const spellId = params.id;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect("/onboarding");

  const spell = await fetchSpellById(spellId);

  return (
    <section className="relative">
      <div>
        <SpellCard
          key={spell._id}
          id={spell._id}
          currentUserId={user?.id || ""}
          parentId={spell.parentId}
          content={spell.text}
          author={spell.author}
          community={spell.community}
          createdAt={spell.createdAt}
          comments={spell.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          spellId={spell._id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10 flex flex-col">
        {spell.children.map((childItem: any) => (
          <SpellCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user?.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
}

export default Page;
