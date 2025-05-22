import { NextRequest } from "next/server";
import { getCoaches } from "@/controllers/coachs/coach.controller";
export const GET=async(req:NextRequest)=>{
    return await getCoaches(req);
}