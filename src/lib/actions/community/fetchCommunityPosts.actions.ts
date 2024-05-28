"use server";

import connectDB from "@/lib/dbConnect";
import CommunityModel from "@/models/community.model";
import SpellModel from "@/models/spell.model";
import UserModel from "@/models/user.model";

export async function fetchCommunityPosts(id: string) {
    try {
      connectDB();
  
      const communityPosts = await CommunityModel
      .findById(id)
      .populate({
        path: "spells",
        model: SpellModel,
        populate: [
          {
            path: "author",
            model: UserModel,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
          {
            path: "children",
            model: SpellModel,
            populate: {
              path: "author",
              model: UserModel,
              select: "image _id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      });
  
      return communityPosts;
    } catch (error) {
      // Handle any errors
      console.error("Error fetching community posts:", error);
      throw error;
    }
  }