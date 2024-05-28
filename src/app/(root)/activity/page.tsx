import UserCard from "@/components/cards/UserCard";
import { fetchUser } from "@/lib/actions/user/fetchUser.actions";
import { fetchUsers } from "@/lib/actions/user/fetchUsers.actions";
import { getActivity } from "@/lib/actions/user/getUsersActivity.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Get activities
  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((acc) => (
              <Link key={acc._id} href={`/spell/${acc.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={acc.author.image}
                    alt="profile photo"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-base-regular text-light-1">
                    <span className="mr-1 text-slate-400">
                      {acc.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity</p>
        )}
      </section>
    </section>
  );
};

export default Page;
