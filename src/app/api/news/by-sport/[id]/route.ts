import { NextRequest } from "next/server";
import { getAllNewsBysport } from "@/controllers/news/news.controller";

export const GET=async(req:NextRequest,context:{params:{id:string}})=>{
    return await getAllNewsBysport(req,context)
}