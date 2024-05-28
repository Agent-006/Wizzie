"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import SpellModel from "@/models/spell.model";
import UserModel from "@/models/user.model";

export async function deleteCommunity(communityId: string) {
    try {
      connectDB();
  
      // Find the community by its ID and delete it
      const deletedCommunity = await CommunityModel.findOneAndDelete({
        id: communityId,
      });
  
      if (!deletedCommunity) {
        throw new Error("Community not found");
      }
  
      // Delete all spells associated with the community
      await SpellModel.deleteMany({ community: communityId });
  
      // Find all users who are part of the community
      const communityUsers = await UserModel.find({ communities: communityId });
  
      // Remove the community from the 'communities' array for each user
      const updateUserPromises = communityUsers.map((user) => {
        user.communities.pull(communityId);
        return user.save();
      });
  
      await Promise.all(updateUserPromises);
  
      return deletedCommunity;
    } catch (error) {
      console.error("Error deleting community: ", error);
      throw error;
    }
}