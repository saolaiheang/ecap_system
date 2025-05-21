import { NextRequest } from "next/server";
import { createMatchFriendly,getMatchFriendlyBySport } from "@/controllers/match_friendly.controller/match_friendly";

export const POST=async(req:NextRequest,context:{params:{id:string}})=>{
    return await createMatchFriendly(req,context);
}
export const GET=async(req:NextRequest,context:{params:{id:string}})=>{
    return await getMatchFriendlyBySport(req,context);
    }  