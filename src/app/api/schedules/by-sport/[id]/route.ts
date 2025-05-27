import { NextRequest } from "next/server";
import { getAllScheduleBySport, ScheduleParams} from "@/controllers/schedules/schedules.training.controller";

export const GET=async(req:NextRequest,context:ScheduleParams)=>{
    return await getAllScheduleBySport(req,context)
}