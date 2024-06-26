"use server";

import connectDB from "@/lib/dbConnect";
import SpellModel from "@/models/spell.model";
import UserModel from "@/models/user.model";

export async function getActivity(userId: string) {
    try {
        connectDB();

        // find all spells created by the user
        const userSpells = await SpellModel.find({ author: userId })

        // collect all the child spell ids (replies) from the 'children' field
        const childSpellIds = userSpells.reduce((acc, userSpell) => {
            return acc.concat(userSpell.children)
        }, [])

        // find and return the child spells excluding the ones created by the same user
        const replies = await SpellModel.find({
            _id: { $in: childSpellIds },
            author: { $ne: userId } // excluding the spells authored by the same user
        })
        .populate({
            path: 'author',
            model: UserModel,
            select: 'name image _id',
        })

        return replies;
    } catch (error: any) {
        throw new Error(`Failed to fetch activities: ${error.message}`)
    }
}