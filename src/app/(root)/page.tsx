import SpellCard from "@/components/cards/SpellCard";
import { fetchSpells } from "@/lib/actions/spell/fetchSpells.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {

  const user = await currentUser();
  
  const result = await fetchSpells(1, 30);


  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.spells.length === 0 ? (
          <p className="no-result">No spells found</p>
        ) : (
          <>
            {result.spells.map((spell) => (
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
            ))}
          </>
        )}
      </section>
    </>
  );
}
