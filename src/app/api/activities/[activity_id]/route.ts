import { NextRequest } from "next/server";
import { getActivityById, deleteActivities, editeActivities, ActivityParams } from "@/controllers/activities/activities.controller";
export const GET = async (req: NextRequest, context:ActivityParams) => {
    return await getActivityById(req, context)
};
export const DELETE = async (req: NextRequest, context:ActivityParams) => {
    return await deleteActivities(req, context)
};
export const PUT = async (req: NextRequest, context: ActivityParams) => {
    return await editeActivities(req, context)
};