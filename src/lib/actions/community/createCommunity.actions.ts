"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import UserModel from "@/models/user.model";

export async function createCommunity(
    id: string,
    name: string,
    username: string,
    image: string,
    bio: string,
    createdById: string // Change the parameter name to reflect it's an id
  ) {
    try {
      connectDB();
  
      // Find the user with the provided unique id
      const user = await UserModel.findOne({ id: createdById });
  
      // Handle the case if the user with the id is not found
      if (!user) {
        throw new Error("User not found");
      }
  
      const newCommunity = new CommunityModel({
        id,
        name,
        username,
        image,
        bio,
        createdBy: user._id, // Use the mongoose ID of the user
      });
  
      const createdCommunity = await newCommunity.save();
  
      // Update User model
      user.communities.push(createdCommunity._id);
      await user.save();
  
      return createdCommunity;
    } catch (error) {
      // Handle any errors
      console.error("Error creating community:", error);
      throw error;
    }
  }