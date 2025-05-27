import { NextRequest } from "next/server";
import { getMatchById, deleteMatch ,updateMatch, MatchIdParams} from "@/controllers/matches/matches.controller";


export const GET = async (req: NextRequest, context:MatchIdParams) => {
    return await getMatchById(req, context);
}
export const DELETE = async (req: NextRequest, context: MatchIdParams) => {
    return await deleteMatch(req, context);
}  
export const PATCH = async (req: NextRequest, context: MatchIdParams)=>{
    return await updateMatch(req,context);
}