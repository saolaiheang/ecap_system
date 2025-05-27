import { NextRequest, NextResponse } from "next/server";
import {deleteNews,updateNews,getNewsById, NewsParams } from "@/controllers/news/news.controller";

export const DELETE = async(req:NextRequest,context:NewsParams)=>{
    try {
        const news = await deleteNews(req, context);
        return news

    } catch (error) {
        return NextResponse.json({ error: "Error getting news",message:error })
    }

}
export const PUT= async (req:NextRequest, context:NewsParams)=>{
    try {
        const news = await updateNews(req, context);
        return news

    } catch (error) {
        return NextResponse.json({ error: "Error getting news",message:error })
    }

}
export const GET = async (req: NextRequest, context:NewsParams)=>{
    return await getNewsById(req,context);
}