"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import UserModel from "@/models/user.model";

export async function addMemberToCommunity(
    communityId: string,
    memberId: string
  ) {
    try {
      connectDB();
  
      // Find the community by its unique id
      const community = await CommunityModel.findOne({ id: communityId });
  
      if (!community) {
        throw new Error("Community not found");
      }
  
      // Find the user by their unique id
      const user = await UserModel.findOne({ id: memberId });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      // Check if the user is already a member of the community
      if (community.members.includes(user._id)) {
        throw new Error("User is already a member of the community");
      }
  
      // Add the user's _id to the members array in the community
      community.members.push(user._id);
      await community.save();
  
      // Add the community's _id to the communities array in the user
      user.communities.push(community._id);
      await user.save();
  
      return community;
    } catch (error) {
      // Handle any errors
      console.error("Error adding member to community:", error);
      throw error;
    }
  }