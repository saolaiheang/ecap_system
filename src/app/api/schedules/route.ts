import { NextRequest } from "next/server";
import { createScheduleTraining,getAllSchedules } from "@/controllers/schedules/schedules.training.controller";

export const POST=async(req:NextRequest)=>{
    return await createScheduleTraining(req);
}
export const GET=async(req:NextRequest)=>{
    return await getAllSchedules(req);
}