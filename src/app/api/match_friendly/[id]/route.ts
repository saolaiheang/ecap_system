import { NextRequest } from "next/server";
import { getMatchFriendlyById, deleteMatchFriendlyById, updateMatchFriendlyById } from "@/controllers/match_friendly.controller/match_friendly";
export const GET = async ( context: { params: { id: string } }) => {
    return await getMatchFriendlyById( context);
}
export const DELETE = async ( context: { params: { id: string } }) => {
    return await deleteMatchFriendlyById( context);
}
export const UPDATE = async (req: NextRequest, context: { params: {id: string}}) =>{
    return await updateMatchFriendlyById(req, context);
}