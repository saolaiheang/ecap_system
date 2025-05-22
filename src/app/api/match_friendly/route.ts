import { getAllMatch } from "@/controllers/matches/matches.controller";
import { NextRequest } from "next/server";
export const GET=async(req:NextRequest)=>{
    return await getAllMatch(req);
}