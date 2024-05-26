"use server";

import connectDB from "@/lib/dbConnect";
import SpellModel from "@/models/spell.model";
import UserModel from "@/models/user.model";

export async function fetchSpellById(spellId: string) {
    connectDB();

    try {

        // TODO: populate community
        const spell = await SpellModel
        .findById({_id: spellId})
        .populate({
            path: 'author',
            model: UserModel,
            select: "_id id name image",
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: UserModel,
                    select: '_id id name parentId image',
                },
                {
                    path: 'children',
                    model: SpellModel,
                    populate: {
                        path: 'author',
                        model: UserModel,
                        select: '_id id name parentId image',
                    }
                }
            ]
        }).exec()

        return spell;        
    } catch (error: any) {
        throw new Error(`Error fetching spell: ${error.message}`)
    }
}