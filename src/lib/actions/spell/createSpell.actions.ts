"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import SpellModel from "@/models/spell.model";
import UserModel from "@/models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createSpell({ text, author, communityId, path }:Params){
    try {
        connectDB();

        const communityIdObject = await CommunityModel.findOne(
            { id: communityId },
            { _id: 1 }
        )
    
        const createdSpell = await SpellModel.create({
            text,
            author,
            community: communityIdObject,
        });
    
        // Update user model
        await UserModel.findByIdAndUpdate(author, {
            $push: { spells: createdSpell._id}
        })

        if(communityIdObject) {
            // update community model
            await CommunityModel.findByIdAndUpdate(
                communityIdObject,
                {
                    $push: { spells: createdSpell._id }
                },
            );
        }
    
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating spell: ${error.message}`)
    }
}