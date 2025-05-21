import { NextRequest } from "next/server";
import { updateTeam } from "@/controllers/team/team.controller";
export const PATCH=async(req:NextRequest,context:{params:{id:string}})=>{
    return await updateTeam(req,context);
}