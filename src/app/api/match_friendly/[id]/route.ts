import { NextRequest } from "next/server";
import { getMatchFriendlyById, deleteMatchFriendlyById, updateMatchFriendlyById, MatchFriendlyParams } from "@/controllers/match_friendly.controller/match_friendly";
export const GET = async (req: NextRequest, context:MatchFriendlyParams) => {
    return await getMatchFriendlyById(req, context);
}
export const DELETE = async (req: NextRequest, context: MatchFriendlyParams) => {
    return await deleteMatchFriendlyById(req, context);
}
export const PATCH = async (req: NextRequest, context:MatchFriendlyParams
) =>{
    return await updateMatchFriendlyById(req, context);
}