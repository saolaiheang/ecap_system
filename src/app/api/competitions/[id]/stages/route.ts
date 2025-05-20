import { NextRequest } from "next/server";
import { createStage,getStages } from "@/controllers/stages/stages.controller";
export const POST=async(req:NextRequest,context:{params:{id:string}})=>{
    return await createStage(req,context)
}
export const GET=async(req:NextRequest,context:{params:{id:string}})=>{
    return await getStages(req,context)
    }