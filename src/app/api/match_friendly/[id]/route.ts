import { NextRequest } from "next/server";
import { getMatchFriendlyById, deleteMatchFriendlyById, updateMatchFriendlyById } from "@/controllers/match_friendly.controller/match_friendly";
export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
    return await getMatchFriendlyById(req, context);
}
export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
    return await deleteMatchFriendlyById(req, context);
}
export const PATCH = async (req: NextRequest, context: { params: {id: string}
}) =>{
    return await updateMatchFriendlyById(req, context);
}