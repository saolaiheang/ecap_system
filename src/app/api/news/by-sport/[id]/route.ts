import { NextRequest } from "next/server";
import { getAllNewsBysport, NewsParams } from "@/controllers/news/news.controller";

export const GET=async(req:NextRequest,context:NewsParams)=>{
    return await getAllNewsBysport(req,context)
}