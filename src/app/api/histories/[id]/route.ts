import { NextRequest } from "next/server";
import { deleteHistory,HistoryParams,updateHistory } from "@/controllers/histories/histories.controller";
export const DELETE=async(req:NextRequest,context:HistoryParams)=>{
    return await deleteHistory(req,context);
}

export const PUT=async (req:NextRequest,context:HistoryParams)=>{
    return await updateHistory(req,context);
}