import { NextRequest } from "next/server";
import { getActivityById, deleteActivities, editeActivities } from "@/controllers/activities/activities.controller";
export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
    return await getActivityById(req, context)
}
export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
    return await deleteActivities(req, context)
}
export const PUT = async (req: NextRequest, context: { params: { id: string } }) => {
    return await editeActivities(req, context)
}