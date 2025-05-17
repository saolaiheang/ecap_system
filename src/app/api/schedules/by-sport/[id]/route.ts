import { NextRequest } from "next/server";
import { getAllScheduleBySport} from "@/controllers/schedules/schedules.training.controller";

export const GET=async(req:NextRequest,context:{params:{id:string}})=>{
    return await getAllScheduleBySport(req,context)
}