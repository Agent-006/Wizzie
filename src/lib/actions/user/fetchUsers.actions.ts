"use server";

import connectDB from "@/lib/dbConnect"
import UserModel from "@/models/user.model";
import { FilterQuery, SortOrder } from "mongoose";

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
}: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) 
{
    try {
        connectDB();

        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(searchString, "i");

        // Create an initial query object to filter users.
        const query: FilterQuery<typeof UserModel> = {
            id: { $ne: userId } // excluding the current user
        }

        // If the search string is not empty, add the $or operator to match either username or name fields.
        if(searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }
        
        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = { createdAt: sortBy };

        const usersQuery = UserModel.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);

        // Count the total number of users that match the search criteria (without pagination).
        const totalUsersCount = await UserModel.countDocuments(query);

        const users = await usersQuery.exec();

        // Check if there are more users beyond the current page.
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };        
    } catch (error: any) {
        throw new Error(`Error in fetching the users: ${error.message}`)
    }
}