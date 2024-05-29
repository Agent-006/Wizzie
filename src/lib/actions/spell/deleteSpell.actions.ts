"use server";

import connectDB from "@/lib/dbConnect";
import SpellModel from "@/models/spell.model";
import { fetchAllChildSpells } from "./fetchAllChildSpells.actions";
import UserModel from "@/models/user.model";
import CommunityModel from "@/models/community.model";
import { revalidatePath } from "next/cache";

export async function deleteSpell(id: string, path: string): Promise<void> {
    try {
        connectDB();

        // find the spell to be deleted
        const mainSpell = await SpellModel
        .findById(id)
        .populate('author community');

        if (!mainSpell) {
            throw new Error("Spell no found");
        }

        // fetch all child spells and their descendants recursively
        const descendentSpells = await fetchAllChildSpells(id);

        // get all child spell ids including the main spell id and child spell id
        const descendantSpellIds = [
            id,
            ...descendentSpells.map((spell)=> spell._id),
        ];

        // extract the authorIds and communityIds to update User and Community models respectively
        const uniqueAuthorIds = new Set(
            [
                ...descendentSpells.map((spell) => spell.author?._id?.toString()),
                mainSpell.author?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        const uniqueCommunityIds = new Set(
            [
                ...descendentSpells.map((spell)=> spell.community?._id?.toString()),
                mainSpell.community?._id?.toString(),
            ].filter((id)=> id !== undefined)
        );

        // recurcively delete child spells and their descendants
        await SpellModel.deleteMany({
            _id: { $in: descendantSpellIds }
        });

        // update User model
        await UserModel.updateMany(
            {
                _id: { $in: Array.from(uniqueAuthorIds) }
            },
            {
                $pull: { spells: { $in: descendantSpellIds } }
            },
        );

        // update community model
        await CommunityModel.updateMany(
            {
                _id: { $in: Array.from(uniqueCommunityIds) }
            },
            {
                $pull: { splles: { $in: descendantSpellIds } }
            },
        );

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete thread: ${error.message}`);
    }
}