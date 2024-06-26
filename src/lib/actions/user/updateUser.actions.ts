"use server";

import UserModel from "@/models/user.model";
import connectDB from "../../dbConnect"
import { revalidatePath } from "next/cache";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}


export async function updateUser(
    {
    userId,
    username,
    name,
    bio,
    image,
    path,
}: Params
): Promise<void>{
    
    connectDB();

    try {
        await UserModel.findOneAndUpdate(
            {id: userId},
            {
                username: username.toLowerCase(), 
                name,
                bio,
                image,
                onboarded: true,
            },
            {
                upsert: true,
            }
        )

        if(path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}