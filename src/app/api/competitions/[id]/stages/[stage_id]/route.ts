import { NextRequest } from "next/server";
import { getStage, deleteStage, updateStage, StageIdParams } from "@/controllers/stages/stages.controller";
export const GET = async (req: NextRequest, context: StageIdParams) => {
    return await getStage(req, context);
}
export const DELETE = async (req: NextRequest, context:StageIdParams) => {
    return await deleteStage(req, context);
}
export const PUT = async (req: NextRequest, context: StageIdParams) => {
    return await updateStage(req, context);
}