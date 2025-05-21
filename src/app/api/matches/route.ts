import { NextRequest } from "next/server";
import { getAllMatch } from "@/controllers/matches/matches.controller";
export const GET=async(req:NextRequest)=>{
    return await getAllMatch(req);
}