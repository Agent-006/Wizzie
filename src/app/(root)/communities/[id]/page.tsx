import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import SpellsTab from "@/components/shared/SpellsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import { fetchCommunityDetails } from "@/lib/actions/community/fetchCommunityDetails.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();

  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section className="text-light-1 head-text">
      <ProfileHeader
        accountId={communityDetails.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="spells" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />

                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Spells" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityDetails?.spells?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
            <TabsContent
              value="spells"
              className="w-full text-light-1"
            >
              <SpellsTab
                currentUserId={user.id}
                accountId={communityDetails._id}
                accountType="Community"
              />
            </TabsContent>
            <TabsContent
              value="members"
              className="w-full text-light-1"
            >
              <section className="mt-9 flex flex-col gap-10">
                {communityDetails?.members.map((member: any)=>(
                    <UserCard
                        key={member.id}
                        id={member.id}
                        name={member.name}
                        username={member.username}
                        imgUrl={member.image}
                        personType="User"
                    />
                ))}
              </section>
            </TabsContent>
            <TabsContent
              value="requests"
              className="w-full text-light-1"
            >
              <SpellsTab
                currentUserId={user.id}
                accountId={communityDetails._id}
                accountType="Community"
              />
            </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
