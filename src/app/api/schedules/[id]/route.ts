import { NextRequest } from "next/server";

import { deleteSchedule,updateSchedule } from "@/controllers/schedules/schedules.training.controller";

export const DELETE=async(req:NextRequest,context:{params:{id:string}})=>{
    return await deleteSchedule(req,context)
}

export const PATCH=async(req:NextRequest,context:{params:{id:string}})=>{
    return await updateSchedule(req,context)
}