import { NextRequest,NextResponse } from "next/server";
import { createMatch,getAllMatchByStage } from "@/controllers/matches/matches.controller";

export const POST=async(req:NextRequest,context:{params:{id:string,stage_id:string}})=>{
    return await createMatch(req,context);
}
export const GET= async(req:NextRequest,context:{params:{id:string,stage_id:string}})=>{
    return await getAllMatchByStage(req,context);
}