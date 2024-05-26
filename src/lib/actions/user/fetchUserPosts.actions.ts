"use server";

import connectDB from "@/lib/dbConnect";
import SpellModel from "@/models/spell.model";
import UserModel from "@/models/user.model";

export async function fetchUserPosts(userId: string) {
    try {
        connectDB();

        // find all spells authored by user with the given userId

        // TODO: populate community
        const spells = await UserModel.findOne({id: userId})
        .populate({
            path: 'spells',
            model: SpellModel,
            populate: {
                path: 'children',
                model: SpellModel,
                populate: {
                    path: 'author',
                    model: UserModel,
                    select: 'name image id'
                }
            }
        })

        return spells;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}