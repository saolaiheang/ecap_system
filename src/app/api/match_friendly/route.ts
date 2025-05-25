import { NextRequest } from "next/server";
import { getAllMatchFriendly } from "@/controllers/match_friendly.controller/match_friendly";
export const GET=async(req:NextRequest)=>{
    return await getAllMatchFriendly(req);
}