import { NextRequest} from "next/server";
import { createMatch,getAllMatchByStage, MatchParams } from "@/controllers/matches/matches.controller";

export const POST=async(req:NextRequest,context:MatchParams)=>{
    return await createMatch(req,context);
}
export const GET= async(req:NextRequest,context:MatchParams)=>{
    return await getAllMatchByStage(req,context);
}