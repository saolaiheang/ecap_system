import { NextRequest } from "next/server";
import { createActivities,getAllActbySport } from "@/controllers/activities/activities.controller";
export const POST=async(req:NextRequest,context:{params:{id:string}})=>{
return await createActivities(req,context)
}
export const GET=async(req:NextRequest,context:{params:{id:string}})=>{
    return await getAllActbySport(req,context)
    }