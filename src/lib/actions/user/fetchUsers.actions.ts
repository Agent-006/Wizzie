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

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof UserModel> = {
            id: { $ne: userId }
        }

        if(searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }
        
        const sortOptions = { createdAt: sortBy };

        const usersQuery = UserModel.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);

        const totalUsersCount = await UserModel.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };        
    } catch (error: any) {
        throw new Error(`Error in fetching the users: ${error.message}`)
    }
}