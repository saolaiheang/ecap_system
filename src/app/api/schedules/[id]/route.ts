import { NextRequest } from "next/server";

import { deleteSchedule,ScheduleParams,updateSchedule } from "@/controllers/schedules/schedules.training.controller";

export const DELETE=async(req:NextRequest,context:ScheduleParams)=>{
    return await deleteSchedule(req,context)
}

export const PATCH=async(req:NextRequest,context:ScheduleParams)=>{
    return await updateSchedule(req,context)
}