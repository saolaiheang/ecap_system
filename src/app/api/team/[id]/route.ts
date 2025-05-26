import { NextRequest } from "next/server";
import { updateTeam ,deleteTeam} from "@/controllers/team/team.controller";
export const PUT=async(req:NextRequest,context:{params:{id:string}})=>{
    return await updateTeam(req,context);
}
export const DELETE=async(req:NextRequest,context:{params:{id:string}})=>{
    return await deleteTeam(req,context);
    }