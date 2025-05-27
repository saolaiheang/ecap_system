import { deletePlayerById,PlayerParams,updatePlayerById } from "@/controllers/players/players.controller";
import { NextRequest } from "next/server"
export const DELETE=async(req:NextRequest,context:PlayerParams)=>{
    return await deletePlayerById(req,context)
}
export const PUT=async(req:NextRequest,context:PlayerParams)=>{
    return await updatePlayerById(req,context)
    }
