"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import SpellModel from "@/models/spell.model";
import UserModel from "@/models/user.model";

export async function fetchUserPosts(userId: string) {
    try {
        connectDB();

        // find all spells authored by user with the given userId
        const spells = await UserModel
        .findOne({id: userId})
        .populate({
            path: 'spells',
            model: SpellModel,
            populate: [
                {
                    path: 'community',
                    model: CommunityModel,
                    select: 'name id image _id',
                },
                {
                    path: 'children',
                    model: SpellModel,
                    populate: {
                        path: 'author',
                        model: UserModel,
                        select: 'name image id'
                    },
                },
            ],
        });

        return spells;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}