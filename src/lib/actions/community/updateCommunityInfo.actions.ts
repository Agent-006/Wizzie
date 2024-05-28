"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";

export async function updateCommunityInfo(
    communityId: string,
    name: string,
    username: string,
    image: string
  ) {
    try {
      connectDB();
  
      // Find the community by its _id and update the information
      const updatedCommunity = await CommunityModel.findOneAndUpdate(
        { id: communityId },
        { name, username, image }
      );
  
      if (!updatedCommunity) {
        throw new Error("Community not found");
      }
  
      return updatedCommunity;
    } catch (error) {
      // Handle any errors
      console.error("Error updating community information:", error);
      throw error;
    }
  }