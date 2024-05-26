"use server";

import connectDB from "@/lib/dbConnect";
import SpellModel from "@/models/spell.model";
import { revalidatePath } from "next/cache";

export async function addCommentToSpell (
    spellId: string,
    commentText: string,
    userId: string,
    path: string,
) 
{
    connectDB();

    try {
        // Find the original spell by its ID
        const originalSpell = await SpellModel.findById(spellId);
        
        if(!originalSpell) {
            throw new Error("Spell not found")
        }
        
        // Create a new thread with the comment text
        const commentSpell = new SpellModel({
            text: commentText,
            author: userId,
            parentId: spellId,
        })

        // Save the new spell
        const savedCommentSpell = await commentSpell.save();

        // Update the original spell to include the new comment
        originalSpell.children.push(savedCommentSpell._id);

        // Save the original spell
        await originalSpell.save();

        revalidatePath(path);
        
    } catch (error: any) {
        throw new Error(`Error adding comment to spell: ${error.message}`)
    }
}