import { NextRequest } from "next/server";
import { getMatchById, deleteMatch ,updateMatch} from "@/controllers/matches/matches.controller";


export const GET = async (req: NextRequest, context: { params: { id: string, stage_id: string, match_id: string } }) => {
    return await getMatchById(req, context);
}
export const DELETE = async (req: NextRequest, context: { params: { id: string, stage_id: string, match_id: string } }) => {
    return await deleteMatch(req, context);
}  
export const PATCH = async (req: NextRequest, context: { params: { id: string,stage_id:string,match_id:string}})=>{
    return await updateMatch(req,context);
}