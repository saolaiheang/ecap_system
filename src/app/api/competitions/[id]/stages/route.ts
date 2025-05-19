import { NextRequest,NextResponse } from "next/server";
import { createStage } from "@/controllers/stages/stages.controller";
export const POST=async(req:NextRequest,context:{params:{id:string}})=>{
    return await createStage(req,context)
}