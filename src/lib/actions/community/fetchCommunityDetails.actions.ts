"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import UserModel from "@/models/user.model";

export async function fetchCommunityDetails(id: string) {
    try {
      connectDB();

      const communityDetails = await CommunityModel
      .findOne({ id })
      .populate([
        "createdBy",
        {
          path: "members",
          model: UserModel,
          select: "name username image _id id",
        },
      ]);

      return communityDetails;
    } catch (error) {
      // Handle any errors
      console.error("Error fetching community details:", error);
      throw error;
    }
  }
