import { deleteCoachById, updateCoachById } from "@/controllers/coachs/coach.controller";
import { NextRequest } from "next/server";
export const DELETE = async (context: { params: { id: string } }) => {
    return await deleteCoachById(context)
}
export const PUT = async (req: NextRequest, context: { params: { id: string } }) => {
    return await updateCoachById(req, context)
}