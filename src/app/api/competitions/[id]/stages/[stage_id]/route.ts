import { NextRequest } from "next/server";
import { getStage, deleteStage, updateStage } from "@/controllers/stages/stages.controller";
export const GET = async (req: NextRequest, context: { params: { stage_id: string } }) => {
    return await getStage(req, context);
}
export const DELETE = async (req: NextRequest, context: { params: { stage_id: string } }) => {
    return await deleteStage(req, context);
}
export const PUT = async (req: NextRequest, context: { params: { stage_id: string } }) => {
    return await updateStage(req, context);
}