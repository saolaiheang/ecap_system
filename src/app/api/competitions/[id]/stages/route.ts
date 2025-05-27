import { NextRequest } from "next/server";
import { createStage,getStages, StageParams } from "@/controllers/stages/stages.controller";
export const POST=async(req:NextRequest,context:StageParams)=>{
    return await createStage(req,context)
}
export const GET=async(req:NextRequest,context:StageParams)=>{
    return await getStages(req,context)
    }