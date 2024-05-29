"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import SpellModel from "@/models/spell.model";
import UserModel from "@/models/user.model";

export async function fetchSpells(pageNumber = 1, pageSize = 20) {
    // Connect to the database
    connectDB();

    // Calculate the number of spells to skip based on the current page number and page size
    const skipAmount = (pageNumber - 1) * pageSize;

    // Construct the query to fetch top-level spells, sorted by creation date in descending order
    const spellsQuery = SpellModel
        .find({ parentId: { $in: [null, undefined] } }) // Fetch spells with no parent (top-level spells)
        .sort({ createdAt: 'desc' }) // Sort by creation date in descending order
        .skip(skipAmount) // Skip the specified number of spells for pagination
        .limit(pageSize) // Limit the results to the specified page size
        .populate({ 
            path: 'author', 
            model: UserModel,
        }) // Populate the author field with data from UserModel
        .populate({
            path: 'community',
            model: CommunityModel,
        })
        .populate({ 
            path: 'children',
            populate: {
                path: 'author',
                model: UserModel,
                select: '_id name parentId image', // Select specific fields from the author's data
            }
        });

    // Count the total number of top-level spells in the collection
    const totalSpellsCount = await SpellModel.countDocuments({ parentId: { $in: [null, undefined] } });

    // Execute the query to fetch the spells
    const spells = await spellsQuery.exec();

    // Determine if there are more spells to fetch (for pagination)
    const isNext = totalSpellsCount > skipAmount + spells.length;

    // Return the fetched spells and the isNext flag
    return { spells, isNext };
}