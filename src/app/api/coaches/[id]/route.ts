import { CoachParams, deleteCoachById, updateCoachById } from "@/controllers/coachs/coach.controller";
import { NextRequest } from "next/server";
export const DELETE = async (req:NextRequest,context:CoachParams) => {
    return await deleteCoachById(req,context)
}
export const PUT = async (req: NextRequest, context: CoachParams) => {
    return await updateCoachById(req, context)
}