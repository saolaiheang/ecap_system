import { NextRequest } from "next/server";
import { updateTeam ,deleteTeam, TeamParams} from "@/controllers/team/team.controller";
export const PUT=async(req:NextRequest,context:TeamParams)=>{
    return await updateTeam(req,context);
}
export const DELETE=async(req:NextRequest,context:TeamParams)=>{
    return await deleteTeam(req,context);
    }