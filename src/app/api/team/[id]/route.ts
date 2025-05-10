import { NextRequest,NextResponse } from "next/server";
import { createTeam } from "@/controllers/team/team.controller";
export const POST = async (req:NextRequest,context: { params: { id: string } }) => {
    try{
        const params = context.params;
        
        if (!params?.id) {
          return new Response(JSON.stringify({ error: "Team ID is required" }), { status: 400 });
        }
        const {id} = params;

        const {name,division,sport_id} = await req.json();
       
    const team = await createTeam(name,division,sport_id,id);
    console.log(team);
    return NextResponse.json({ message: 'Team created successfully', data: team }, { status: 201 });
    }catch (error: any) {
        console.error(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}