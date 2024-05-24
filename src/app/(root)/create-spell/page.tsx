import PostSpell from "@/components/forms/PostSpell";
import { fetchUser } from "@/lib/actions/user/fetchUser.actions";
import { currentUser } from "@clerk/nextjs/server";
import {redirect} from 'next/navigation';

async function Page() {

    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');
    
    return (
        <>
        <h1 className="head-text">Create Spell</h1>

        <PostSpell userId={userInfo._id}/>
        </>
    )
}

export default Page;