"use server";

import connectDB from "@/lib/dbConnect";
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
    
        const createdSpell = await SpellModel.create({
            text,
            author,
            community: null,
        });
    
        // Update user model
        await UserModel.findByIdAndUpdate(author, {
            $push: { spells: createdSpell._id}
        })
    
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating spell: ${error.message}`)
    }
}