"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import UserModel from "@/models/user.model";


export async function fetchUser(userId: string) {
    try {
        connectDB();

        return await UserModel
        .findOne(
            {
                id: userId,
            }
        )
        .populate(
            {
                path: 'communities',
                model: CommunityModel,
            }
        );
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}