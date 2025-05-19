import { NextRequest } from "next/server";
import { deleteHistory,updateHistory } from "@/controllers/histories/histories.controller";
export const DELETE=async(req:NextRequest,context:{params:{id:string}})=>{
    return await deleteHistory(req,context);
}

export const PUT=async (req:NextRequest,context:{params:{id:string}})=>{
    return await updateHistory(req,context);
}