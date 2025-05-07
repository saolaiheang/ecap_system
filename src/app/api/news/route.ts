import { NextRequest,NextResponse } from "next/server";
import { createNews,getNews } from "@/controllers/news/news.controller";
export const POST = async (req:NextRequest): Promise <NextResponse> =>{
    try{
        const response = await createNews(req);
        return response;
        
    }catch(error){
        return NextResponse.json({error: error}, {status: 500});
    }
   
}
export const GET = async (req:NextRequest): Promise<NextResponse>=>{
    try{
        const response = await getNews(req);
        return response;
    }catch(error){
        return NextResponse.json({error: error}, {status: 500});
    }
}
