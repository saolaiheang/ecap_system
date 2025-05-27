import { NextRequest } from "next/server";
import { createActivities,getAllActbySport, SportParams } from "@/controllers/activities/activities.controller";
export const POST=async(req:NextRequest,context:SportParams)=>{
return await createActivities(req,context)
}
export const GET=async(req:NextRequest,context:SportParams)=>{
    return await getAllActbySport(req,context)
}